# coding=utf_8
# Son las validaciones de los servicios rest, se validan los parametros obtenidos desde las llamadas externas rest

import numbers

import app.domain.articles.crud_service as crud
import app.utils.errors as error
import app.utils.schema_validator as schemaValidator

# Son validaciones sobre las propiedades que pueden actualizarse desde REST
ARTICLE_UPDATE_SCHEMA = {
    "name": {
        "type": str,
        "minLen": 1,
        "maxLen": 60
        },
    "description": {
        "type": str,
        "maxLen": 2048
        },
    "image": {
        "type": str,
        "minLen": 30,
        "maxLen": 40
        },
    "price": {
        "type": numbers.Real,
        "min": 0
        },
    "stock": {
        "type": numbers.Integral,
        "min": 0
        }
}


def validateAddArticleParams(params):
    """
    Valida los parametros para crear un objeto.\n
    params: dict<propiedad, valor> Article
    """
    if ("_id" in params):
        raise error.InvalidArgument("_id", "Inválido")

    return schemaValidator.validateAndClean(ARTICLE_UPDATE_SCHEMA, params)


def validateEditArticleParams(articleId, params):
    """
    Valida los parametros para actualizar un objeto.\n
    params: dict<propiedad, valor> Article
    """
    if (not articleId):
        raise error.InvalidArgument("_id", "Inválido")

    return schemaValidator.validateAndClean(ARTICLE_UPDATE_SCHEMA, params)


def validateArticleExist(articleId):
    article = crud.getArticle(articleId)
    if("enabled" not in article or not article["enabled"]):
        raise error.InvalidArgument("_id", "Inválido")
