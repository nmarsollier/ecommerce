import flask
import articles.service as articleService
import utils.json_serializer as json
import utils.errors as errors


def init(app):

    @app.route('/catalog', methods=['POST'])
    def addArticle():
        try:
            result = articleService.addArticle(json.body_to_dic(flask.request.data))
            return json.dic_to_json(result)
        except Exception as err:
            return errors.handleError(err)

    @app.route('/catalog/<catalogId>', methods=['GET'])
    def getArticle(catalogId):
        try:
            return json.dic_to_json(articleService.getArticle(catalogId))
        except Exception as err:
            return errors.handleError(err)

    @app.route('/catalog/<catalogId>', methods=['DELETE'])
    def delArticle(catalogId):
        try:
            articleService.delArticle(catalogId)
            return ""
        except Exception as err:
            return errors.handleError(err)

    @app.route('/catalog/search/<criteria>', methods=['GET'])
    def searchArticles(criteria):
        try:
            return json.dic_to_json(articleService.searchArticles(criteria))
        except Exception as err:
            return errors.handleError(err)
