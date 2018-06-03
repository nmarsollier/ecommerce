import http.client
import socket
import utils.json_serializer as json
import utils.errors as errors
import memoize

memo = memoize.Memoizer({})


@memo(max_age=3600)
def isAutorized(authKey):
    """
    Obtiene el currentUser desde el servicio de authenticacion
    authKey: string El header Authorization enviado por el cliente
    return dict<property, value> CurrentUser
    """
    if (not isinstance(authKey, str) or len(authKey) == 0):
        raise errors.InvalidAuth()

    headers = {"Authorization".encode("utf-8"): authKey.encode("utf-8")}

    conn = http.client.HTTPConnection(socket.gethostbyname("localhost"), 3000)

    conn.request("GET", "/auth/currentUser", {}, headers)
    response = conn.getresponse()

    if (response.status != 200):
        raise errors.InvalidAuth()

    result = json.body_to_dic(response.read().decode('utf-8'))
    if (len(result) == 0):
        raise errors.InvalidAuth()

    return result
