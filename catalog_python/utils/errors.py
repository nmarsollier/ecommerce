"""
@apiDefine Errors

@apiSuccessExample {json} 400 Bad Request
    HTTP/1.1 400 Bad Request
    {
        "path" : "{Nombre de la propiedad}",
        "message" : "{Motivo del error}"
    }

@apiSuccessExample {json} 400 Bad Request
    HTTP/1.1 400 Bad Request
    {
        "error" : "{Motivo del error}"
    }

@apiSuccessExample {json} 500 Server Error
    HTTP/1.1 500 Server Error
    {
        "error" : "{Motivo del error}"
    }
"""
import utils.json_serializer as json
import traceback


class InvalidRequest(Exception):
    def __init__(self, error):
        self.error = error

    def __str__(self):
        return repr(self.error)


class InvalidArgument(Exception):
    def __init__(self, path, error):
        self.path = path
        self.error = error

    def __str__(self):
        return repr(self.path)


class MultipleArgumenException(Exception):
    def __init__(self, error):
        self.errors = error

    def __str__(self):
        return repr(self.path)


def handleError(err):
    """
    Controla cualquier error que se de en el proceso, da como resultado un string json con informacion del error.
    err: Exception
    result json error a enviar al cliente
    """
    traceback.print_exc()
    if isinstance(err, InvalidArgument):
        return handleInvalidArgument(err)
    elif isinstance(err, InvalidRequest):
        return handleInvalidRequest(err)
    elif isinstance(err, MultipleArgumenException):
        return handleMultipleArgumenException(err)
    else:
        return handleUnknown(err)


def handleMultipleArgumenException(err):
    """
    Multiples argumentos con errores.
    err: MultipleArgumenException
    result json error a enviar al cliente
    """
    return json.dic_to_json(err.errors), 400


def handleInvalidArgument(err):
    """
    Argumento con errores.
    err: InvalidArgument
    result json error a enviar al cliente
    """
    return json.dic_to_json({"path": err.path, "message": err.error}), 400


def handleInvalidRequest(err):
    """
    Request con errores.
    err: InvalidRequest
    result json error a enviar al cliente
    """
    return json.dic_to_json({"error": err.error}), 400


def handleUnknown(err):
    """
    Cualquier otro error.
    err: Exception
    result json error a enviar al cliente
    """
    return json.dic_to_json({"error": "Unknown error"}), 500
