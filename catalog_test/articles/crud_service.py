import utils.mongo as db
import utils.errors as error
import bson.objectid as bson
import datetime
import validation_service as validator


"""
@api {get} /articles/:articleId Buscar articulo
@apiName GetArticle
@apiGroup Articulos

@apiSuccessExample {json} Respuesta
    HTTP/1.1 200 OK
    {
        "_id": "{id de articulo}"
        "name": "{nombre del articulo}",
        "description": "{descripcion del articulo}",
        "image": "{id de imagen}",
        "price": {precio actual},
        "stock": {stock actual}
        "updated": {fecha ultima actualizacion}
        "created": {fecha creacion}
        "valid": {activo}
    }

@apiUse Errors

"""


def getArticle(docId):
    try:
        result = db.articles.find_one({"_id": bson.ObjectId(docId)})
        if (not result):
            raise error.InvalidArgument("_id", "Document does not exists")
        return result
    except Exception:
        raise error.InvalidArgument("_id", "Invalid object id")


"""
@api {post} /articles/ Crear articulo
@apiName AddArticle
@apiGroup Articulos

@apiParamExample {json} Body
    {
        "name": "{nombre del articulo}",
        "description": "{descripcion del articulo}",
        "image": "{id de imagen}",
        "price": {precio actual},
        "stock": {stock actual}
    }

@apiSuccessExample {json} Respuesta
    HTTP/1.1 200 OK
    {
        "_id": "{id de articulo}"
        "name": "{nombre del articulo}",
        "description": "{descripcion del articulo}",
        "image": "{id de imagen}",
        "price": {precio actual},
        "stock": {stock actual}
        "updated": {fecha ultima actualizacion}
        "created": {fecha creacion}
        "valid": {si esta activo}
    }

@apiUse Errors

"""


def addArticle(params):
    validator.validateAddArticleParams(params)
    addOrUpdateArticle(params)


"""
@api {post} /articles/:articleId Actualizar articulo
@apiName UpdateArticle
@apiGroup Articulos

@apiParamExample {json} Body
    {
        "name": "{nombre del articulo}",
        "description": "{descripcion del articulo}",
        "image": "{id de imagen}",
        "price": {precio actual},
        "stock": {stock actual}
    }

@apiSuccessExample {json} Respuesta
    HTTP/1.1 200 OK
    {
        "_id": "{id de articulo}"
        "name": "{nombre del articulo}",
        "description": "{descripcion del articulo}",
        "image": "{id de imagen}",
        "price": {precio actual},
        "stock": {stock actual}
        "updated": {fecha ultima actualizacion}
        "created": {fecha creacion}
        "valid": {si esta activo}
    }

@apiUse Errors

"""


def updateArticle(articleId, params):
    params["_id"] = articleId
    validator.validateAddArticleParams(params)
    addOrUpdateArticle(params)


def addOrUpdateArticle(params):
    isNew = True
    article = {}
    if ("_id" in params):
        isNew = False
        article = getArticle(params["_id"])

    if ("name" in params):
        article["name"] = params["name"]

    if ("description" in params):
        article["description"] = params["description"]
    elif (isNew):
        article["description"] = ""

    if ("image" in params):
        article["image"] = params["image"]
    elif (isNew):
        article["image"] = ""

    if ("stock" in params):
        article["stock"] = int(params["stock"])
    elif (isNew):
        article["stock"] = 0

    if ("price" in params):
        article["price"] = float(params["price"])
    elif (isNew):
        article["price"] = 0.0

    if (not isNew):
        article["updated"] = datetime.datetime.utcnow()
        db.articles.save(article)
    else:
        article["updated"] = datetime.datetime.utcnow()
        article["created"] = datetime.datetime.utcnow()
        article["valid"] = True
        article["_id"] = db.articles.insert_one(article).inserted_id

    return article


"""
@api {delete} /articles/:articleId Eliminar articulo
@apiName DelArticle
@apiGroup Articulos

@apiSuccessExample {json} 200 Respuesta
    HTTP/1.1 200 OK

@apiUse Errors

"""


def delArticle(docId):
    article = getArticle(docId)
    article["updated"] = datetime.datetime.utcnow()
    article["valid"] = False
    db.articles.save(article)
