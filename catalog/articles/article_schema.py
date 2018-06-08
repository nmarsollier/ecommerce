# coding=utf_8

import numbers
import datetime
import sys

ARTICLE_SCHEMA = {
    "name": (str, 1, 60),
    "description": (str, 0, 2048),
    "image": (str, 0, 50),
    "price": (numbers.Real, 0, sys.maxsize),
    "stock": (numbers.Integral, 0, sys.maxsize)
}


def newArticle():
    """
    Crea un nuevo articulo en blanco.\n
    return dict<propiedad, valor> Articulo
    """

    return {
        "name": "",
        "description": "",
        "image": "",
        "price": 0.0,
        "stock": 0,
        "updated": datetime.datetime.utcnow(),
        "created": datetime.datetime.utcnow(),
        "enabled": True
    }


def validateSchema(article):
    """
    Valida el esquema de db, este se debe ejecutar antes de insertar o agregar
    a la db.\n
    params: dict<propiedad, valor> Article
    """

    errors = {}

    # Errores de tipos de datos inválidos en parametros
    errors.update(
        dict((k, "Invalid") for (k, v) in article.items()
             if k in ARTICLE_SCHEMA.keys()
             and not isinstance(v, ARTICLE_SCHEMA[k][0])))

    # Validamos tamaños de strings
    errors.update(
        dict((k, "Invalid size") for (k, v) in article.items()
             if k in ARTICLE_SCHEMA.keys() and isinstance(v, str) and (
                 len(v.strip()) < ARTICLE_SCHEMA[k][1]
                 or len(v.strip()) > ARTICLE_SCHEMA[k][2])))

    # Validamos valores maximos y minimos de números
    errors.update(
        dict(
            (k, "Invalid size") for (k, v) in article.items()
            if k in ARTICLE_SCHEMA.keys() and (
                isinstance(v, numbers.Real) or isinstance(v, numbers.Integral))
            and (v < ARTICLE_SCHEMA[k][1]
                 or v > ARTICLE_SCHEMA[k][2])))

    if (len(errors) > 0):
        raise errors.MultipleArgumentException(errors)
