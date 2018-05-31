import utils.mongo as db
import utils.errors as error
import bson.objectid as bson
import re
import datetime


def validateArticleParams(params):
    if ("_id" in params):
        objId = params["_id"]
        if (type(objId) != str):
            raise error.InvalidArgument("_id", "Invalid")
        if (len(objId) < 1 or len(objId) > 60):
            raise error.InvalidArgument("_id", "Invalid size")

    if ("name" in params):
        name = params["name"]
        if (type(name) != str):
            raise error.InvalidArgument("name", "Invalid")
        if (len(name) < 1 or len(name) > 60):
            raise error.InvalidArgument("name", "Invalid size")
    else:
        raise error.InvalidArgument("name", "Required")

    if ("description" in params):
        description = params["description"]
        if (type(description) != str):
            raise error.InvalidArgument("description", "Invalid")
        if (len(description) < 1 or len(description) > 2048):
            raise error.InvalidArgument("description", "Invalid size")

    if ("image" in params):
        image = params["image"]
        if (type(image) != str):
            raise error.InvalidArgument("image", "Invalid")
        if (len(image) < 1 or len(image) > 50):
            raise error.InvalidArgument("image", "Invalid size")


def getArticle(docId):
    try:
        result = db.articles.find_one({"_id": bson.ObjectId(docId)})
        if (not result):
            raise error.InvalidArgument("_id", "Document does not exists")
        return result
    except Exception:
        raise error.InvalidArgument("_id", "Invalid object id")


def addArticle(params):
    validateArticleParams(params)

    article = {}
    if ("_id" in params):
        article = getArticle(params["_id"])

    if ("name" in params):
        article["name"] = params["name"]

    if ("description" in params):
        article["description"] = params["description"]

    if ("image" in params):
        article["image"] = params["image"]

    if ("_id" in article and article["_id"]):
        article["updated"] = datetime.datetime.utcnow()
        db.articles.save(article)
    else:
        article["updated"] = datetime.datetime.utcnow()
        article["created"] = datetime.datetime.utcnow()
        article["valid"] = True
        article["_id"] = db.articles.insert_one(article).inserted_id

    return article


def delArticle(docId):
    article = getArticle(docId)
    article["updated"] = datetime.datetime.utcnow()
    article["valid"] = False
    db.articles.save(article)


def searchArticles(text):
    try:
        regx = re.compile(text, re.IGNORECASE)
        results = []

        cursor = db.articles.find({
            "$and": [{
                "valid": True
            }, {
                "$or": [{
                    "name": regx
                }, {
                    "description": regx
                }]
            }]
        })
        for doc in cursor:
            results.append(doc)
        return results
    except Exception:
        raise error.InvalidRequest("Invalid search criteria")
