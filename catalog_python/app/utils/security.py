# coding=utf_8

import http.client
import socket

import memoize

import app.utils.config as config
import app.utils.errors as errors
import app.utils.json_serializer as json

memoKeys = {}

memo = memoize.Memoizer(memoKeys)

"""
@apiDefine AuthHeader

@apiExample {String} Header Autorización
    Authorization=bearer {token}

@apiErrorExample 401 Unauthorized
    HTTP/1.1 401 Unauthorized
 """


@memo(max_age=3600)
def isValidToken(authKey):
    """
    Obtiene el currentUser desde el servicio de autentificación
    authKey: string El header Authorization enviado por el cliente
    return dict<property, value> CurrentUser
    """
    if (not isinstance(authKey, str) or len(authKey) == 0):
        raise errors.InvalidAuth()

    headers = {"Authorization".encode("utf-8"): authKey.encode("utf-8")}

    conn = http.client.HTTPConnection(
        socket.gethostbyname(config.get_security_server_url()),
        config.get_security_server_port(),
    )

    conn.request("GET", "/v1/users/current", {}, headers)
    response = conn.getresponse()

    if (response.status != 200):
        raise errors.InvalidAuth()

    result = json.body_to_dic(response.read().decode('utf-8'))
    if (len(result) == 0):
        raise errors.InvalidAuth()

    return result


def validateAdminRole(token):
    """
    Valida si el usuario actual tiene rol de admin.\n
    token: string Header Auth Token
    """
    profile = isValidToken(token)
    if ("permissions" not in profile or "admin" not in profile["permissions"]):
        raise errors.InvalidAccessLevel()


def invalidateSession(token):
    """
    Invalida un token del cache.\n
    token: string Header Auth Token
    """
    if (isinstance(token, str) and isValidToken.exists((token, ))):
        print("Key eliminada %r" % token)
        isValidToken.delete((token, ))
