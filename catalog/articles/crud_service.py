import utils.mongo as db
import utils.errors as error
import bson.objectid as bson
import datetime
import articles.validation_service as validator
import articles.article_schema as schema


def getArticle(articleId):
    """
    Obtiene un articulo. \n
    articleId: string ObjectId\n
    return dict<propiedad, valor> Articulo\n
    """
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
    validator.validateAddArticleParams(params)

    return addOrUpdateArticle(params)


def updateArticle(articleId, params):
    """
    Actualiza un articulo. \n
    articleId: string ObjectId\n
    params: dict<propiedad, valor> Articulo\n
    return dict<propiedad, valor> Articulo\n
    """
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
    params["_id"] = articleId
    validator.validateEditArticleParams(params)
    return addOrUpdateArticle(params)


def addOrUpdateArticle(params):
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
    article.update(
        dict((k, v.strip() if isinstance(v, str) else v)
             for (k, v) in params.items() if k in schema.ARTICLE_SCHEMA.keys()
             and isinstance(v, schema.ARTICLE_SCHEMA[k][0])))

    article["updated"] = datetime.datetime.utcnow()

    validator.validateSchema(article)

    if (not isNew):
        db.articles.save(article)
    else:
        article["_id"] = db.articles.insert_one(article).inserted_id

    return article


def delArticle(articleId):
    """
    Marca un articulo como invalido.\n
    articleId: string ObjectId
    """
    """
    Elimina un articulo : delArticle(articleId: string)

    @api {delete} /articles/:articleId Eliminar articulo
    @apiName DelArticle
    @apiGroup Articulos

    @apiSuccessExample {json} 200 Respuesta
        HTTP/1.1 200 OK

    @apiUse Errors

    """
    article = getArticle(articleId)
    article["updated"] = datetime.datetime.utcnow()
    article["valid"] = False
    db.articles.save(article)
