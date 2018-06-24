import utils.errors as errors


def validateSchema(schema, document):
    """
    Valida un documento contra un esquema dado

    schema: Documento con validaciones
        {
            "strProperty": {
                "required": True,
                "type": str,
                "minLen": 60
                "maxLen": 60
                },
            "numberProperty": {
                "required": False,
                "type": numbers.Integral | numbers.Real,
                "min": 0
                "max": 0
                },...
        }

    retorna: Lista de errores
    """

    errors = {}

    for (k, v) in schema.items():
        required = "required" in v and v["required"]
        if(required and k not in document):
            errors[k] = "Requerido"

        if(k in document):
            value = document[k]
            if("type" in v and not isinstance(value, v["type"])):
                errors[k] = "Tipo invalido"

            if("type" in v and not isinstance(value, v["type"])):
                errors[k] = "Tipo invalido"
                continue

            if("minLen" in v):
                minLen = v["minLen"]
                size = len(value.strip())
                if(not (minLen <= size or (not required and size == 0))):
                    errors[k] = "Minimo requerido: %s" % minLen

            if("maxLen" in v):
                maxLen = v["maxLen"]
                size = len(value.strip())
                if(not (maxLen >= size or (not required and size == 0))):
                    errors[k] = "Maximo permitido: %s" % maxLen

            if("min" in v):
                min = v["min"]
                if(not (min <= value or (not required and value == 0))):
                    errors[k] = "Minimo requerido: %s" % min

            if("max" in v):
                max = v["max"]
                if(not (max >= value or (not required and value == 0))):
                    errors[k] = "Maximo permitido: %s" % max

    return errors


def validateAndClean(schema, data):
    """
    Valida un esquema con una estructura especifica, ver función validateSchema.
    Si la estructura no es valida, larga una exception MultipleArgumentException
    Si la estructura es valida, limpia los datos y devuelve un documento nuevo sólo
    con datos validos
    """
    err = validateSchema(schema, data)
    if (len(err) > 0):
        raise errors.MultipleArgumentException(err)
    else:
        result = {}
        result.update(
            dict((k, v.strip() if isinstance(v, str) else v)
                 for (k, v) in data.items() if k in schema.keys()))
        return result


def clean(schema, data):
    """
    Limpia una estructura especifica comparando con un esquema, ver función validateSchema.
    """
    result = {}
    result.update(
        dict((k, v.strip() if isinstance(v, str) else v)
             for (k, v) in data.items() if k in schema.keys()))
    return result
