# coding=utf_8

import utils.mongo as db
import bson.objectid as bson
import pymongo.collection as pymongo
import utils.errors as errors
import numbers


def reserveStock(articleId, quantity):
    """
    Genera una reserva de stock para un articulo.
    Esto significa que se va a descontar del stock la cantidad indicada en el articulo.
    articleId: string ObjectId del articulo
    quantity: int Cantidad a descontar
    """
    if (not isinstance(quantity, numbers.Integral) or quantity <= 0):
        raise errors.InvalidArgument("quantity", "Invalid quantity")

    result = db.articles.find_one_and_update(
        {
            "$and": [{
                '_id': bson.ObjectId(articleId)
            }, {
                'enabled': True
            }, {
                'stock': {
                    "$gte": quantity
                }
            }]
        }, {'$inc': {
            'stock': -int(quantity)
        }},
        return_document=pymongo.ReturnDocument.AFTER)

    if (not result):
        raise errors.InvalidArgument("quantity", "Invalid quantity")

    return result


def increaseStock(articleId, quantity):
    """
    Registra una compra de stock para un articulo.
    Esto significa que se va a incrementar el stock del articulo en la cantidad indicada.
    articleId: string ObjectId del articulo
    quantity: int Cantidad a incrementar
    """

    if (not isinstance(quantity, numbers.Integral) or quantity <= 0):
        raise errors.InvalidArgument("quantity", "Invalid quantity")

    result = db.articles.find_one_and_update(
        {
            "$and": [{
                '_id': bson.ObjectId(articleId)
            }, {
                'enabled': True
            }]
        }, {'$inc': {
            'stock': quantity
        }},
        return_document=pymongo.ReturnDocument.AFTER)

    if (not result):
        raise errors.InvalidArgument("quantity", "Invalid quantity")

    return result
