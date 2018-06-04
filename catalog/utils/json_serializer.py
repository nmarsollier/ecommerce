# coding=utf_8

import json
import datetime
import bson.objectid as bson


def json_serial(obj):
    """
    Configura un serializador que permite serializar los datos primitivos correctamente.
    """
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    if isinstance(obj, bson.ObjectId):
        return str(obj)
    raise TypeError("Type %s not serializable" % type(obj))


def dic_to_json(doc):
    """
    Convierte un diccionario a json\n
    doc: dict
    result json
    """
    return json.dumps(doc, default=json_serial)


def body_to_dic(body):
    """
    Convierte un json string a un diccionario.
    body: string json
    result dict <propiedad, valor>
    """
    return json.loads(body)
