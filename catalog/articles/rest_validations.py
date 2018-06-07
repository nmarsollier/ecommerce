# coding=utf_8
# Son las validaciones de los servicios rest, se validan los parametros obtenidos desde las llamadas externas rest

import utils.errors as error
import numbers
import articles.article_schema as schema
import articles.crud_service as crud


def validateAddArticleParams(params):
    """
    Valida los parametros para crear un objeto.\n
    params: dict<propiedad, valor> Article
    """
    if ("_id" in params):
        raise error.InvalidArgument("_id", "Invalid property")

    validateArticleParams(params)


def validateEditArticleParams(articleId, params):
    """
    Valida los parametros para actualizar un objeto.\n
    params: dict<propiedad, valor> Article
    """
    if (not articleId):
        raise error.InvalidArgument("_id", "Invalid")

    validateArticleParams(params)


def validateArticleParams(params):
    """
    Valida los parametros para actualizar un objeto.\n
    params: dict<propiedad, valor> Article
    """
    errors = {}
    # Errores de tipos de datos invalidos en parametros
    errors.update(
        dict((k, "Invalid") for (k, v) in params.items()
             if k in schema.ARTICLE_SCHEMA.keys()
             and not isinstance(v, schema.ARTICLE_SCHEMA[k][0])))

    # Validamos solo los datos correctos
    validArgs = dict((k, v) for (k, v) in params.items()
                     if k in schema.ARTICLE_SCHEMA.keys()
                     and isinstance(v, schema.ARTICLE_SCHEMA[k][0]))

    # Validamos tamaños de strings
    errors.update(
        dict((k, "Invalid size") for (k, v) in validArgs.items()
             if k in schema.ARTICLE_SCHEMA.keys() and isinstance(v, str) and (
                 len(v) < schema.ARTICLE_SCHEMA[k][1]
                 or len(v) > schema.ARTICLE_SCHEMA[k][2])))

    # Validamos valores maximos y minimos de numeros
    errors.update(
        dict(
            (k, "Invalid value") for (k, v) in validArgs.items()
            if k in schema.ARTICLE_SCHEMA.keys() and (
                isinstance(v, numbers.Real) or isinstance(v, numbers.Integral))
            and (v < schema.ARTICLE_SCHEMA[k][1]
                 or v > schema.ARTICLE_SCHEMA[k][2])))

    if (len(errors) > 0):
        raise error.MultipleArgumenException(errors)


def validateArticleExist(articleId):
    article = crud.getArticle(articleId)
    if("enabled" not in article or not article["enabled"]):
        raise error.InvalidArgument("_id", "Invalid object id")
