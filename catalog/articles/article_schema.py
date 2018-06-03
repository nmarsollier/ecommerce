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
        "valid": True
    }
