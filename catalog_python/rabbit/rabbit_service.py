import pika
import utils.security as security
import threading
import utils.json_serializer as json
import utils.config as config

EXCHANGE = "auth"


def init():
    """
    Inicializa RabbitMQ para escuchar eventos logout.
    """
    consumer = threading.Thread(target=listen)
    consumer.start()


def listen():
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=config.getRabbitServerUrl()))
        channel = connection.channel()

        channel.exchange_declare(exchange=EXCHANGE, exchange_type='fanout')

        result = channel.queue_declare(exclusive=True)
        queue_name = result.method.queue

        channel.queue_bind(exchange=EXCHANGE, queue=queue_name)

        def callback(ch, method, properties, body):
            event = json.body_to_dic(body.decode('utf-8'))
            if ("type" in event and "message" in event
                    and event["type"] == "logout"):
                security.invalidateSession(event["message"])

        print("RabbitMQ conectado")

        channel.basic_consume(callback, queue=queue_name, no_ack=True)

        channel.start_consuming()
    except Exception:
        print("RabbitMQ desconectado, intentando reconectar en 10'")
        threading.Timer(10.0, init).start()
