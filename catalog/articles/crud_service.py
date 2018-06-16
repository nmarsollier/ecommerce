# coding=utf_8

import utils.mongo as db
import utils.errors as error
import bson.objectid as bson
import datetime
import articles.article_schema as schema


def getArticle(articleId):
    """
    Obtiene un articulo. \n
    articleId: string ObjectId\n
    return dict<propiedad, valor> Articulo\n
    """
    """
    @api {get} /v1/articles/:articleId Buscar Artículo
    @apiName Buscar Artículo
    @apiGroup Articulos

    @apiSuccessExample {json} Respuesta
        HTTP/1.1 200 OK
        {
            "_id": "{id de articulo}"
            "name": "{nombre del articulo}",
            "description": "{descripción del articulo}",
            "image": "{id de imagen}",
            "price": {precio actual},
            "stock": {stock actual}
            "updated": {fecha ultima actualización}
            "created": {fecha creación}
            "enabled": {activo}
        }

    @apiUse Errors

    """
    try:
        result = db.articles.find_one({"_id": bson.ObjectId(articleId)})
        if (not result):
            raise error.InvalidArgument("_id", "Document does not exists")
        return result
    except Exception:
        raise error.InvalidArgument("_id", "Invalid object id")


def addArticle(params):
    """
    Agrega un articulo.\n
    params: dict<propiedad, valor> Articulo\n
    return dict<propiedad, valor> Articulo
    """
    """
    @api {post} /v1/articles/ Crear Artículo
    @apiName Crear Artículo
    @apiGroup Articulos

    @apiUse AuthHeader

    @apiExample {json} Body
        {
            "name": "{nombre del articulo}",
            "description": "{descripción del articulo}",
            "image": "{id de imagen}",
            "price": {precio actual},
            "stock": {stock actual}
        }

    @apiSuccessExample {json} Respuesta
        HTTP/1.1 200 OK
        {
            "_id": "{id de articulo}"
            "name": "{nombre del articulo}",
            "description": "{descripción del articulo}",
            "image": "{id de imagen}",
            "price": {precio actual},
            "stock": {stock actual}
            "updated": {fecha ultima actualización}
            "created": {fecha creación}
            "enabled": {si esta activo}
        }

    @apiUse Errors

    """
    return _addOrUpdateArticle(params)


def updateArticle(articleId, params):
    """
    Actualiza un articulo. \n
    articleId: string ObjectId\n
    params: dict<propiedad, valor> Articulo\n
    return dict<propiedad, valor> Articulo\n
    """
    """
    @api {post} /v1/articles/:articleId Actualizar Artículo
    @apiName Actualizar Artículo
    @apiGroup Articulos

    @apiUse AuthHeader

    @apiExample {json} Body
        {
            "name": "{nombre del articulo}",
            "description": "{descripción del articulo}",
            "image": "{id de imagen}",
            "price": {precio actual},
            "stock": {stock actual}
        }

    @apiSuccessExample {json} Respuesta
        HTTP/1.1 200 OK
        {
            "_id": "{id de articulo}"
            "name": "{nombre del articulo}",
            "description": "{descripción del articulo}",
            "image": "{id de imagen}",
            "price": {precio actual},
            "stock": {stock actual}
            "updated": {fecha ultima actualización}
            "created": {fecha creación}
            "enabled": {si esta activo}
        }

    @apiUse Errors

    """
    params["_id"] = articleId
    return _addOrUpdateArticle(params)


def delArticle(articleId):
    """
    Marca un articulo como invalido.\n
    articleId: string ObjectId
    """
    """
    Elimina un articulo : delArticle(articleId: string)

    @api {delete} /articles/:articleId Eliminar Artículo
    @apiName Eliminar Artículo
    @apiGroup Articulos

    @apiUse AuthHeader

    @apiSuccessExample {json} 200 Respuesta
        HTTP/1.1 200 OK

    @apiUse Errors

    """
    article = getArticle(articleId)
    article["updated"] = datetime.datetime.utcnow()
    article["enabled"] = False
    db.articles.save(article)


def _addOrUpdateArticle(params):
    """
    Agrega o actualiza un articulo. \n
    params: dict<property, value>) Articulo\n
    return dict<propiedad, valor> Articulo
    """
    isNew = True

    article = schema.newArticle()

    if ("_id" in params):
        isNew = False
        article = getArticle(params["_id"])

    # Actualizamos los valores validos a actualizar
    article.update(params)

    article["updated"] = datetime.datetime.utcnow()

    schema.validateSchema(article)

    if (not isNew):
        db.articles.save(article)
    else:
        article["_id"] = db.articles.insert_one(article).inserted_id

    return article
