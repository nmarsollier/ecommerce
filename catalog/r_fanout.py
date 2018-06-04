import pika
import threading
import time

EXCHANGE = "test"

"""
A fanout exchange routes messages to all of the queues that are bound to it and the routing key
 is ignored. If N queues are bound to a fanout exchange, when a new message is published to that
  exchange a copy of the message is delivered to all N queues. Fanout exchanges are ideal for the
  broadcast routing of messages.
"""


def send():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='fanout')

    channel.queue_declare(exclusive=True, durable=False)

    message = "Hello World!"
    channel.basic_publish(exchange=EXCHANGE, routing_key='', body=message)
    print("Sent %r" % message)


def listen(consumerName):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='fanout')

    result = channel.queue_declare(exclusive=True, durable=False)
    queue_name = result.method.queue

    channel.queue_bind(exchange=EXCHANGE, queue=queue_name)

    def callback(ch, method, properties, body):
        print("%r - %r" % (consumerName, body.decode('utf-8'),))

    print("%r conectado" % consumerName)

    channel.basic_consume(callback, queue=queue_name, no_ack=True)

    channel.start_consuming()

    print("%r desconectado" % consumerName)


consumer1 = threading.Thread(target=listen, args=("Consumer 1",))
consumer1.start()

consumer2 = threading.Thread(target=listen, args=("Consumer 2",))
consumer2.start()

consumer3 = threading.Thread(target=listen, args=("Consumer 3",))
consumer3.start()

while(True):
    time.sleep(1)
    send()
