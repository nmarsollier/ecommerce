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


def handleError(err):
    traceback.print_exc()
    if isinstance(err, InvalidArgument):
        return handleInvalidArgument(err)
    elif isinstance(err, InvalidRequest):
        return handleInvalidRequest(err)
    else:
        return handleUnknown(err)


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


def handleInvalidArgument(err):
    return json.dic_to_json({"path": err.path, "message": err.error}), 400


def handleInvalidRequest(err):
    return json.dic_to_json({"error": err.error}), 400


def handleUnknown(err):
    return json.dic_to_json({"error": "Unknown error"}), 500
