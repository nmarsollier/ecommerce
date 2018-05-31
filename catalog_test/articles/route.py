import flask
import crud_service as crud
import find_service as find
import utils.json_serializer as json
import utils.errors as errors


def init(app):
    @app.route('/articles', methods=['POST'])
    def addArticle():
        try:
            result = crud.addArticle(json.body_to_dic(flask.request.data))
            return json.dic_to_json(result)
        except Exception as err:
            return errors.handleError(err)

    @app.route('/articles/<articleId>', methods=['POST'])
    def updateArticle(articleId):
        try:
            result = crud.updateArticle(articleId,
                                        json.body_to_dic(flask.request.data))
            return json.dic_to_json(result)
        except Exception as err:
            return errors.handleError(err)

    @app.route('/articles/<articleId>', methods=['GET'])
    def getArticle(articleId):
        try:
            return json.dic_to_json(crud.getArticle(articleId))
        except Exception as err:
            return errors.handleError(err)

    @app.route('/articles/<articleId>', methods=['DELETE'])
    def delArticle(articleId):
        try:
            crud.delArticle(articleId)
            return ""
        except Exception as err:
            return errors.handleError(err)

    @app.route('/articles/search/<criteria>', methods=['GET'])
    def searchArticles(criteria):
        try:
            return json.dic_to_json(find.searchArticles(criteria))
        except Exception as err:
            return errors.handleError(err)
