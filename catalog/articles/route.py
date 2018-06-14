# coding=utf_8

import flask
import articles.crud_service as crud
import articles.find_service as find
import utils.json_serializer as json
import utils.errors as errors
import utils.security as security
import articles.rest_validations as restValidator


def init(app):
    """
    Inicializa las rutas para Articulos\n
    app: Flask
    """

    @app.route('/v1/articles', methods=['POST'])
    def addArticle():
        try:
            security.validateAdminRole(flask.request.headers.get("Authorization"))

            params = json.body_to_dic(flask.request.data)

            params = restValidator.validateAddArticleParams(params)

            result = crud.addArticle(params)

            return json.dic_to_json(result)
        except Exception as err:
            return errors.handleError(err)

    @app.route('/v1/articles/<articleId>', methods=['POST'])
    def updateArticle(articleId):
        try:
            security.validateAdminRole(flask.request.headers.get("Authorization"))

            params = json.body_to_dic(flask.request.data)

            params = restValidator.validateEditArticleParams(articleId, params)

            result = crud.updateArticle(articleId, params)

            return json.dic_to_json(result)
        except Exception as err:
            return errors.handleError(err)

    @app.route('/v1/articles/<articleId>', methods=['GET'])
    def getArticle(articleId):
        try:
            return json.dic_to_json(crud.getArticle(articleId))
        except Exception as err:
            return errors.handleError(err)

    @app.route('/v1/articles/<articleId>', methods=['DELETE'])
    def delArticle(articleId):
        try:
            security.validateAdminRole(flask.request.headers.get("Authorization"))
            crud.delArticle(articleId)
            return ""
        except Exception as err:
            return errors.handleError(err)

    @app.route('/v1/articles/search/<criteria>', methods=['GET'])
    def searchArticles(criteria):
        try:
            return json.dic_to_json(find.searchArticles(criteria))
        except Exception as err:
            return errors.handleError(err)
