# coding=utf_8

import utils.mongo as db
import utils.errors as error
import re


def searchArticles(text):
    """
    Busca articulos por nombre o descripción.\n
    test string Texto a buscar
    """
    """
    @api {get} /v1/articles/search/:criteria Buscar Artículo
    @apiName Buscar Artículo
    @apiGroup Articulos
    @apiDescription Busca articulos por nombre o descripción

    @apiSuccessExample {json} Respuesta
        HTTP/1.1 200 OK
        [
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
            },
            ...
        ]

    @apiUse Errors
    """
    try:
        regx = re.compile(text, re.IGNORECASE)
        results = []

        cursor = db.articles.find({
            "$and": [{
                "enabled": True
            }, {
                "$or": [{
                    "name": regx
                }, {
                    "description": regx
                }]
            }]
        })
        for doc in cursor:
            results.append(doc)
        return results
    except Exception:
        raise error.InvalidRequest("Invalid search criteria")
