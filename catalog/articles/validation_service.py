import utils.errors as error
import numbers
import articles.article_schema as schema


def validateAddArticleParams(params):
    """
    Valida los parametros para crear un objeto.\n
    params: dict<propiedad, valor> Article
    """
    if ("_id" in params):
        raise error.InvalidRequest("Already exist")

    if ("name" not in params):
        raise error.InvalidArgument("name", "Required")

    validateArticleParams(params)


def validateEditArticleParams(params):
    """
    Valida los parametros para actualizar un objeto.\n
    params: dict<propiedad, valor> Article
    """
    if ("_id" not in params):
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
        dict((k, "Invlid") for (k, v) in params.items()
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


def validateSchema(article):
    """
    Valida el esquema de db, este se debe ejecutar antes de insertar o agregar a la db.\n
    params: dict<propiedad, valor> Article
    """

    errors = {}

    # Errores de tipos de datos invalidos en parametros
    errors.update(
        dict((k, "Invlid") for (k, v) in article.items()
             if k in schema.ARTICLE_SCHEMA.keys()
             and not isinstance(v, schema.ARTICLE_SCHEMA[k][0])))

    # Validamos tamaños de strings
    errors.update(
        dict((k, "Invalid size") for (k, v) in article.items()
             if k in schema.ARTICLE_SCHEMA.keys() and isinstance(v, str) and (
                 len(v.strip()) < schema.ARTICLE_SCHEMA[k][1]
                 or len(v.strip()) > schema.ARTICLE_SCHEMA[k][2])))

    # Validamos valores maximos y minimos de numeros
    errors.update(
        dict(
            (k, "Invalid size") for (k, v) in article.items()
            if k in schema.ARTICLE_SCHEMA.keys() and (
                isinstance(v, numbers.Real) or isinstance(v, numbers.Integral))
            and (v < schema.ARTICLE_SCHEMA[k][1]
                 or v > schema.ARTICLE_SCHEMA[k][2])))

    if (len(errors) > 0):
        raise errors.MultipleArgumenException(errors)
