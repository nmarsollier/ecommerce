package utils.errors;

import spark.Request;
import spark.Response;


/**
 * Es un Helper para serializar correctamente los errores del sistema.
 *
 * @apiDefine Errors
 *
 * @apiErrorExample 400 Bad Request
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "path" : "{Nombre de la propiedad}",
 *         "message" : "{Motivo del error}"
 *     }
 *
 * @apiErrorExample 400 Bad Request
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error" : "{Motivo del error}"
 *     }
 *
 * @apiErrorExample 500 Server Error
 *     HTTP/1.1 500 Server Error
 *     {
 *         "error" : "{Motivo del error}"
 *     }
 */
public class ErrorHandler {
    /**
     * Maneja los internal errors o sea, cualquier error desconocido.
     */
    public static String handleInternal(Exception e, Request req, Response res) {
        if(e instanceof JsonError) {
            return handleError(res, (JsonError) e);
        }
        e.printStackTrace();
        return handleError(res, new SimpleError(500, "Internal Error"));
    }

    /**
     * Maneja cualquier error que se puede serializar Json.
     */
    public static String handleError(Response res, JsonError err) {
        res.status(err.statusCode());
        return err.toJson();
    }
}