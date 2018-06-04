import pika
import threading
import time


EXCHANGE = "direct_exch"
QUEUE = 'direct_test3'

"""
Direct exchanges are often used to distribute tasks between multiple workers (instances of the
 same application) in a round robin manner. When doing so, it is important to understand that,
 in AMQP 0.9.1, messages are load balanced between consumers and not between queues.
"""


def send():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')

    channel.queue_declare(queue=QUEUE)

    message = "Hello World!"
    channel.basic_publish(exchange=EXCHANGE, routing_key=QUEUE, body=message)
    print("Sent %r" % message)
    connection.close()


def listen(consumerName, queueName):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')

    channel.queue_declare(queue=QUEUE)

    channel.queue_bind(queue=QUEUE, exchange=EXCHANGE, routing_key=QUEUE)

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
