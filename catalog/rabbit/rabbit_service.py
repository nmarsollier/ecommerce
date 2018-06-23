# coding=utf_8

import pika
import utils.security as security
import threading
import utils.json_serializer as json
import utils.config as config
import articles.rest_validations as articleValidation
import articles.crud_service as crud
import utils.schema_validator as validator
import traceback

EVENT = {
    "type": {
        "required": True,
        "type": str
    },
    "message": {
        "required": True
    }
}

EVENT_CALLBACK = {
    "type": {
        "required": True,
        "type": str
    },
    "message": {
        "required": True
    },
    "exchange": {
        "required": True
    },
    "queue": {
        "required": True
    }
}


MSG_ARTICLE_EXIST = {
    "articleId": {
        "required": True,
        "type": str
    },
    "referenceId": {
        "required": True,
        "type": str
    }
}


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
    Inicializa RabbitMQ para escuchar eventos de catalog específicos.
    """
    catalogConsumer = threading.Thread(target=listenCatalog)
    catalogConsumer.start()


def listenAuth():
    """
    Básicamente eventos de logout enviados por auth.

    @api {fanout} auth/logout Logout

    @apiGroup RabbitMQ GET

    @apiDescription Escucha de mensajes logout desde auth. Invalida sesiones en cache.

    @apiExample {json} Mensaje
      {
        "type": "article-exist",
        "message" : "tokenId"
      }
    """
    EXCHANGE = "auth"

    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=config.get_rabbit_server_url()))
        channel = connection.channel()

        channel.exchange_declare(exchange=EXCHANGE, exchange_type='fanout')

        result = channel.queue_declare(exclusive=True)
        queue_name = result.method.queue

        channel.queue_bind(exchange=EXCHANGE, queue=queue_name)

        def callback(ch, method, properties, body):
            event = json.body_to_dic(body.decode('utf-8'))
            if(len(validator.validateSchema(EVENT, event)) > 0):
                return

            if (event["type"] == "logout"):
                security.invalidateSession(event["message"])

        print("RabbitMQ Auth conectado")

        channel.basic_consume(callback, queue=queue_name, no_ack=True)

        channel.start_consuming()
    except Exception:
        print("RabbitMQ Auth desconectado, intentando reconectar en 10'")
        threading.Timer(10.0, initAuth).start()


def listenCatalog():
    """
    article-exist : Es una validación solicitada por Cart para validar si el articulo puede incluirse en el cart

    @api {direct} catalog/article-exist Validación de Articulos

    @apiGroup RabbitMQ GET

    @apiDescription Escucha de mensajes article-exist desde cart. Valida articulos

    @apiExample {json} Mensaje
      {
        "type": "article-exist",
        "exchange" : "{Exchange name to reply}"
        "queue" : "{Queue name to reply}"
        "message" : {
            "referenceId": "{referenceId}",
            "articleId": "{articleId}",
        }
    """
    """
    article-data : Es una validación solicitada por Cart para validar si el articulo puede incluirse en el cart

    @api {direct} catalog/article-exist Validación de Articulos

    @apiGroup RabbitMQ GET

    @apiDescription Escucha de mensajes article-data desde cart. Valida articulos

    @apiExample {json} Mensaje
      {
        "type": "article-exist",
        "exchange" : "{Exchange name to reply}"
        "queue" : "{Queue name to reply}"
        "message" : {
            "referenceId": "{referenceId}",
            "articleId": "{articleId}",
        }
    """
    EXCHANGE = "catalog"
    QUEUE = "catalog"

    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=config.get_rabbit_server_url()))
        channel = connection.channel()

        channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')

        channel.queue_declare(queue=QUEUE)

        channel.queue_bind(queue=QUEUE, exchange=EXCHANGE, routing_key=QUEUE)

        def callback(ch, method, properties, body):
            event = json.body_to_dic(body.decode('utf-8'))
            if(len(validator.validateSchema(EVENT_CALLBACK, event)) > 0):
                return

            if (event["type"] == "article-exist"):
                message = event["message"]
                if(len(validator.validateSchema(MSG_ARTICLE_EXIST, message)) > 0):
                    return

                exchange = event["exchange"]
                queue = event["queue"]
                referenceId = message["referenceId"]
                articleId = message["articleId"]

                print("RabbitMQ Catalog GET article-exist catalogId:%r , articleId:%r", referenceId, articleId)

                try:
                    articleValidation.validateArticleExist(articleId)
                    sendArticleValid(exchange, queue, referenceId, articleId, True)
                except Exception:
                    sendArticleValid(exchange, queue, referenceId, articleId, False)

            if (event["type"] == "article-data"):
                message = event["message"]
                if(len(validator.validateSchema(MSG_ARTICLE_EXIST, message)) > 0):
                    return

                exchange = event["exchange"]
                queue = event["queue"]
                referenceId = message["referenceId"]
                articleId = message["articleId"]

                print("RabbitMQ Catalog GET article-data catalogId:%r , articleId:%r", referenceId, articleId)

                try:
                    article = crud.getArticle(articleId)
                    valid = ("enabled" in article and article["enabled"])
                    stock = article["stock"]
                    price = article["price"]
                    articleValidation.validateArticleExist(articleId)
                    sendArticleData(exchange, queue, referenceId, articleId, valid, stock, price)
                except Exception:
                    sendArticleData(exchange, queue, referenceId, articleId, False, 0, 0)

        print("RabbitMQ Catalog conectado")

        channel.basic_consume(callback, queue=QUEUE, consumer_tag=QUEUE, no_ack=True)

        channel.start_consuming()
    except Exception:
        traceback.print_exc()
        print("RabbitMQ Catalog desconectado, intentando reconectar en 10'")
        threading.Timer(10.0, initCatalog).start()


def sendArticleValid(exchange, queue, referenceId, articleId, valid):
    """
    Envía eventos al Cart

    article-exist : Es una validación solicitada por Cart para validar si el articulo puede incluirse en el cart


    @api {direct} cart/article-exist Validación de Articulos

    @apiGroup RabbitMQ POST

    @apiDescription Enviá de mensajes article-exist desde cart. Valida articulos

    @apiSuccessExample {json} Mensaje
      {
        "type": "article-exist",
        "message" : {
            "referenceId": "{referenceId}",
            "articleId": "{articleId}",
            "valid": True|False
        }
      }
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=config.get_rabbit_server_url()))
    channel = connection.channel()

    channel.exchange_declare(exchange=exchange, exchange_type='direct')

    channel.queue_declare(queue=queue)

    message = {
        "type": "article-exist",
        "message": {
            "referenceId": referenceId,
            "articleId": articleId,
            "valid": valid
        }
    }

    channel.basic_publish(exchange=exchange, routing_key=queue, body=json.dic_to_json(message))

    connection.close()

    print("RabbitMQ Cart POST article-exist catalogId:%r , articleId:%r , valid:%r", referenceId, articleId, valid)


def sendArticleData(exchange, queue, referenceId, articleId, valid, stock, price):
    """
    Envía eventos al Cart

    article-data : Es una validación solicitada por Cart para validar si el articulo puede incluirse en el cart


    @api {direct} cart/article-data Validación de Articulos

    @apiGroup RabbitMQ POST

    @apiDescription Enviá de mensajes article-exist desde cart. Valida articulos

    @apiSuccessExample {json} Mensaje
      {
        "type": "article-exist",
        "message" : {
            "referenceId": "{referenceId}",
            "articleId": "{articleId}",
            "valid": True|False,
            "stock": {stock},
            "price": {price}
        }
      }
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=config.get_rabbit_server_url()))
    channel = connection.channel()

    channel.exchange_declare(exchange=exchange, exchange_type='direct')

    channel.queue_declare(queue=queue)

    message = {
        "type": "article-data",
        "message": {
            "referenceId": referenceId,
            "articleId": articleId,
            "valid": valid,
            "stock": stock,
            "price": price,
        }
    }

    channel.basic_publish(exchange=exchange, routing_key=queue, body=json.dic_to_json(message))

    connection.close()

    print("RabbitMQ Cart POST article-data catalogId:%r , articleId:%r , valid:%r", referenceId, articleId, valid)
