import pika
import threading
import time


EXCHANGE = "test_topic"
ROUTING_KEY = "logs"
QUEUE = "topic5"


def send():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='topic')

    channel.queue_declare(queue=QUEUE)

    message = "Hello World!"
    channel.basic_publish(exchange=EXCHANGE, routing_key=ROUTING_KEY, body=message)
    print("Sent %r" % message)
    connection.close()


def listen(consumerName, queueName):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='topic')

    channel.queue_declare(queue=QUEUE)

    channel.queue_bind(exchange=EXCHANGE, routing_key=ROUTING_KEY, queue=QUEUE)

    def callback(ch, method, properties, body):
        print("%r,%r - %r" % (consumerName, queueName, body.decode('utf-8'),))

    print("%r,%r conectado" % (consumerName, queueName,))

    channel.basic_consume(callback, queue=QUEUE, consumer_tag=queueName, no_ack=True)

    channel.start_consuming()

    print("%r desconectado" % consumerName)


consumer1 = threading.Thread(target=listen, args=("Consumer 1", "Q1"))
consumer1.start()

consumer2 = threading.Thread(target=listen, args=("Consumer 2", "Q1",))
consumer2.start()

consumer3 = threading.Thread(target=listen, args=("Consumer 3", "Q2",))
consumer3.start()

while(True):
    time.sleep(1)
    send()
