import utils.errors as error
import numbers


def validateAddArticleParams(params):
    if ("_id" in params):
        raise error.InvalidRequest("Already exist")
    validateArticleParams(params)


def validateEditArticleParams(params):
    if ("_id" not in params):
        raise error.InvalidArgument("_id", "Invalid")
    validateArticleParams(params)


def validateArticleParams(params):
    isNew = "_id" not in params
    if (not isNew):
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
    elif (isNew):
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

    if ("price" in params):
        price = params["price"]
        if (not isinstance(price, numbers.Real)):
            raise error.InvalidArgument("price", "Invalid")
        if (price < 0):
            raise error.InvalidArgument("price", "Invalid value")

    if ("stock" in params):
        stock = params["stock"]
        if (not isinstance(stock, numbers.Integral)):
            raise error.InvalidArgument("stock", "Invalid")
        if (price < 0):
            raise error.InvalidArgument("stock", "Invalid value")

