# coding=utf_8

"""
@apiDefine Errors

@apiErrorExample 400 Bad Request
    HTTP/1.1 400 Bad Request
    {
        "path" : "{Nombre de la propiedad}",
        "message" : "{Motivo del error}"
    }

@apiErrorExample 400 Bad Request
    HTTP/1.1 400 Bad Request
    {
        "error" : "{Motivo del error}"
    }

@apiErrorExample 500 Server Error
    HTTP/1.1 500 Server Error
    {
        "error" : "{Motivo del error}"
    }
"""
import traceback
import utils.json_serializer as json


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


class MultipleArgumentException(Exception):
    def __init__(self, error):
        self.errors = error

    def __str__(self):
        return repr(self.errors)


class InvalidAuth(Exception):
    pass


class InvalidAccessLevel(Exception):
    pass


def handleError(err):
    """
    Controla cualquier error que se de en el proceso, da como resultado un string json con información del error.
    err: Exception
    result json error a enviar al cliente
    """
    if isinstance(err, InvalidArgument):
        return handleInvalidArgument(err)
    elif isinstance(err, InvalidRequest):
        return handleInvalidRequest(err)
    elif isinstance(err, MultipleArgumentException):
        return handleMultipleArgumentException(err)
    elif isinstance(err, InvalidAuth):
        return handleUnauthorized(err)
    elif isinstance(err, InvalidAccessLevel):
        return handleInvalidAccessLevel(err)
    else:
        traceback.print_exc()
        return handleUnknown(err)


def handleMultipleArgumentException(err):
    """
    Multiples argumentos con errores.
    err: MultipleArgumentException
    result json error a enviar al cliente
    """
    return json.dic_to_json({"messages": [{"path": k, "message": v} for k, v in err.errors.items()]}), 400


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


def handleUnauthorized(err):
    """
    Usuario no autorizado.
    err: InvalidAuth
    result json error a enviar al cliente
    """
    return json.dic_to_json({"error": "Unauthorized"}), 401


def handleInvalidAccessLevel(err):
    """
    Usuario no autorizado.
    err: InvalidAuth
    result json error a enviar al cliente
    """
    return json.dic_to_json({"error": "Insufficient access level"}), 401
