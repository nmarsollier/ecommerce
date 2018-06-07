# coding=utf_8

import pika
import utils.security as security
import threading
import utils.json_serializer as json
import utils.config as config
import articles.rest_validations as articleValidation


def init():
    """
    Inicializa los servicios Rabbit
    """
    initAuth()
    initCatalog()


def initAuth():
    """
    Inicializa RabbitMQ para escuchar eventos logout.
    """
    authConsumer = threading.Thread(target=listenAuth)
    authConsumer.start()


def initCatalog():
    """
    Inicializa RabbitMQ para escuchar eventos de catalog especificos.
    """
    catalogConsumer = threading.Thread(target=listenCatalog)
    catalogConsumer.start()


def listenAuth():
    """
    Basicamente eventos de logout enviados por auth.

    @api {fanout} auth/logout Logout de usuarios

    @apiGroup RabbitMQ GET

    @apiDescription Escucha de mensajes logout desde auth. Invalida sesiones en cache.

    @apiParamExample {json} Mensaje
      {
        "type": "article-exist",
        "message" : "tokenId"
      }
    """
    EXCHANGE = "auth"

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

        print("RabbitMQ Auth conectado")

        channel.basic_consume(callback, queue=queue_name, no_ack=True)

        channel.start_consuming()
    except Exception:
        print("RabbitMQ Auth desconectado, intentando reconectar en 10'")
        threading.Timer(10.0, initAuth).start()


def listenCatalog():
    """
    article-exist : Es una validacion solicitada por Cart para validar si el articulo puede incluirse en el cart

    @api {direct} cart/article-exist Validacion de Articulos

    @apiGroup RabbitMQ GET

    @apiDescription Escucha de mensajes article-exist desde cart. Valida articulos

    @apiParamExample {json} Mensaje
      {
        "type": "article-exist",
        "message" : {
            "cartId": "{cartId}",
            "articleId": "{articleId}",
        }
    """

    EXCHANGE = "catalog"
    QUEUE = "catalog"

    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=config.getRabbitServerUrl()))
        channel = connection.channel()

        channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')

        channel.queue_declare(queue=QUEUE)

        channel.queue_bind(queue=QUEUE, exchange=EXCHANGE, routing_key=QUEUE)

        def callback(ch, method, properties, body):
            event = json.body_to_dic(body.decode('utf-8'))
            if ("type" in event and "message" in event and event["type"] == "article-exist"):
                cartId = event["message"]["cartId"]
                articleId = event["message"]["articleId"]

                print("RabbitMQ Catalog GET article-exist catalogId:%r , articleId:%r", cartId, articleId)

                try:
                    articleValidation.validateArticleExist(articleId)
                    sendArticleValidToCart(cartId, articleId, True)
                except Exception:
                    sendArticleValidToCart(cartId, articleId, False)

        print("RabbitMQ Catalog conectado")

        channel.basic_consume(callback, queue=QUEUE, consumer_tag=QUEUE, no_ack=True)

        channel.start_consuming()
    except Exception:
        print("RabbitMQ Catalog desconectado, intentando reconectar en 10'")
        threading.Timer(10.0, initCatalog).start()


def sendArticleValidToCart(cartId, articleId, valid):
    """
    Envia eventos al Cart

    article-exist : Es una validacion solicitada por Cart para validar si el articulo puede incluirse en el cart


    @api {direct} cart/article-exist Validacion de Articulos

    @apiGroup RabbitMQ POST

    @apiDescription Envia de mensajes article-exist desde cart. Valida articulos

    @apiSuccessExample {json} Mensaje
      {
        "type": "article-exist",
        "message" : {
            "cartId": "{cartId}",
            "articleId": "{articleId}",
            "valid": True|False
        }
      }
    """
    EXCHANGE = "cart"
    QUEUE = "cart"

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=config.getRabbitServerUrl()))
    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')

    channel.queue_declare(queue=QUEUE)

    message = {
        "type": "article-exist",
        "message": {
            "cartId": cartId,
            "articleId": articleId,
            "valid": valid
        }
    }

    channel.basic_publish(exchange=EXCHANGE, routing_key=QUEUE, body=json.dic_to_json(message))

    connection.close()

    print("RabbitMQ Cart POST article-exist catalogId:%r , articleId:%r , valid:%r", cartId, articleId, valid)
