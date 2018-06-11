package errors

import (
	"github.com/gin-gonic/gin"
	validator "gopkg.in/go-playground/validator.v8"
)

/**
 * @apiDefine ParamValidationErrors
 *
 * @apiSuccessExample {json} 400 Bad Request
 *     HTTP/1.1 400 Bad Request
 *     HTTP/1.1 Header X-Status-Reason: {Message}
 *     {
 *        "messages" : [
 *          {
 *            "path" : "{Nombre de la propiedad}",
 *            "message" : "{Motivo del error}"
 *          },
 *          ...
 *       ]
 *     }
 */

/**
 * @apiDefine OtherErrors
 *
 * @apiSuccessExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     HTTP/1.1 Header X-Status-Reason: {Message}
 *     {
 *        "url" : "{Url no encontrada}",
 *        "error" : "Not Found"
 *     }
 *
 * @apiSuccessExample {json} 500 Server Error
 *     HTTP/1.1 500 Internal Server Error
 *     HTTP/1.1 Header X-Status-Reason: {Message}
 *     {
 *        "error" : "Not Found"
 *     }
 *
 */

// GinError es un error que se serializa en Gin
type GinError interface {
	Handle(c *gin.Context)
}

// NewValidationErrorError un error de validcion para un solo field
func NewValidationErrorError(field string, err string) error {
	result := make(validator.ValidationErrors)

	result[field] = &validator.FieldError{
		Field: field,
		Tag:   err,
	}

	return result
}
