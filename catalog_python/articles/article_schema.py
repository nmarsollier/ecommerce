# coding=utf_8

import numbers
import datetime
import utils.schema_validator as validator
import utils.errors as errors

# Validaciones generales del esquema, se valida solo lo que el usuario puede cambiar
ARTICLE_DB_SCHEMA = {
    "name": {
        "required": True,
        "type": str,
        "minLen": 1,
        "maxLen": 60
        },
    "description": {
        "required": False,
        "type": str,
        "maxLen": 2048
        },
    "image": {
        "required": False,
        "type": str,
        "minLen": 30,
        "maxLen": 40
        },
    "price": {
        "required": False,
        "type": numbers.Real,
        "min": 0
        },
    "stock": {
        "required": False,
        "type": numbers.Integral,
        "min": 0
        }
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


def validateSchema(document):
    err = validator.validateSchema(ARTICLE_DB_SCHEMA, document)

    if (len(err) > 0):
        raise errors.MultipleArgumentException(err)
