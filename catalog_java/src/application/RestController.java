package application;

import java.util.List;
import java.util.stream.Collectors;

import article.Article;
import article.ArticleRepository;
import article.vo.DescriptionData;
import article.vo.NewData;
import security.TokenService;
import spark.Request;
import spark.Response;
import utils.errors.ErrorHandler;
import utils.errors.SimpleError;
import utils.errors.ValidationError;
import utils.gson.Builder;

public class RestController {
    /**
     * @api {post} /v1/articles/ Crear Artículo
     * @apiName Crear Artículo
     * @apiGroup Artículos
     *
     * @apiUse AuthHeader
     *
     * @apiExample {json} Body
     *   {
     *       "name": "{nombre del articulo}",
     *       "description": "{descripción del articulo}",
     *       "image": "{id de imagen}",
     *       "price": {precio actual},
     *       "stock": {stock actual}
     *   }
     *
     * @apiSuccessExample {json} Respuesta
     *   HTTP/1.1 200 OK
     *   {
     *       "_id": "{id de articulo}"
     *       "name": "{nombre del articulo}",
     *       "description": "{descripción del articulo}",
     *       "image": "{id de imagen}",
     *       "price": {precio actual},
     *       "stock": {stock actual}
     *       "updated": {fecha ultima actualización}
     *       "created": {fecha creación}
     *       "enabled": {si esta activo}
     *   }
     *
     * @apiUse Errors
     */
    public static String addArticle(Request req, Response res) {
        try {
            TokenService.validateAdmin(req.headers("Authorization"));

            Article article = Article.newArticle(NewData.fromJson(req.body()));
            ArticleRepository.getInstance().save(article);

            return article.value().toJson();
        } catch (ValidationError | SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
     * @api {post} /v1/articles/:articleId Actualizar Artículo
     * @apiName Actualizar Artículo
     * @apiGroup Artículos
     *
     * @apiUse AuthHeader
     *
     * @apiExample {json} Body
     *     {
     *         "name": "{nombre del articulo}",
     *         "description": "{descripción del articulo}",
     *         "image": "{id de imagen}",
     *         "price": {precio actual},
     *         "stock": {stock actual}
     *     }
     *
     * @apiSuccessExample {json} Respuesta
     *     HTTP/1.1 200 OK
     *     {
     *         "_id": "{id de articulo}"
     *         "name": "{nombre del articulo}",
     *         "description": "{descripción del articulo}",
     *         "image": "{id de imagen}",
     *         "price": {precio actual},
     *         "stock": {stock actual}
     *         "updated": {fecha ultima actualización}
     *         "created": {fecha creación}
     *         "enabled": {si esta activo}
     *     }
     *
     * @apiUse Errors
     */
    public static String updateArticle(Request req, Response res) {
        try {
            TokenService.validateAdmin(req.headers("Authorization"));

            ArticleRepository repository = ArticleRepository.getInstance();
            Article article = repository.get(req.params(":articleId"));
            article.updateDescription(DescriptionData.fromJson(req.body()));

            NewData otherParams = NewData.fromJson(req.body());
            article.updatePrice(otherParams.price);
            article.updateStock(otherParams.stock);

            repository.save(article);

            return article.value().toJson();
        } catch (ValidationError | SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
     * @api {get} /v1/articles/:articleId Buscar Artículo
     * @apiName Buscar Artículo
     * @apiGroup Articulos
     *
     * @apiSuccessExample {json} Respuesta
     *   HTTP/1.1 200 OK
     *   {
     *     "_id": "{id de articulo}"
     *     "name": "{nombre del articulo}",
     *     "description": "{descripción del articulo}",
     *     "image": "{id de imagen}",
     *     "price": {precio actual},
     *     "stock": {stock actual}
     *     "updated": {fecha ultima actualización}
     *     "created": {fecha creación}
     *     "enabled": {activo}
     *   }
     *
     * @apiUse Errors
     */
    public static String getArticle(Request req, Response res) {
        try {
            Article article = ArticleRepository.getInstance().get(req.params(":articleId"));

            return article.value().toJson();
        } catch (ValidationError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
     * @api {delete} /articles/:articleId Eliminar Artículo
     * @apiName Eliminar Artículo
     * @apiGroup Artículos
     *
     * @apiUse AuthHeader
     *
     * @apiSuccessExample {json} 200 Respuesta
     *     HTTP/1.1 200 OK
     *
     * @apiUse Errors
     */
    public static String deleteArticle(Request req, Response res) {
        try {
            TokenService.validateAdmin(req.headers("Authorization"));

            ArticleRepository repository = ArticleRepository.getInstance();
            Article article = repository.get(req.params(":articleId"));
            article.disable();
            repository.save(article);

            return "";
        } catch (ValidationError | SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
     * @api {get} /v1/articles/search/:criteria Buscar Artículo
     * @apiName Buscar Artículo
     * @apiGroup Artículos
     * @apiDescription Busca artículos por nombre o descripción
     *
     * @apiSuccessExample {json} Respuesta
     *     HTTP/1.1 200 OK
     *     [
     *         {
     *             "_id": "{id de articulo}"
     *             "name": "{nombre del articulo}",
     *             "description": "{descripción del articulo}",
     *             "image": "{id de imagen}",
     *             "price": {precio actual},
     *             "stock": {stock actual}
     *             "updated": {fecha ultima actualización}
     *             "created": {fecha creación}
     *             "enabled": {activo}
     *         },
     *         ...
     *    ]
     *
     * @apiUse Errors
     */
    public static String searchArticles(Request req, Response res) {
        List<Article> result = ArticleRepository.getInstance().findByCriteria(req.params(":criteria"));

        return Builder.gson().toJson( //
                result.stream() //
                        .map(article -> article.value()) //
                        .collect(Collectors.toList()) //
        );
    }
}