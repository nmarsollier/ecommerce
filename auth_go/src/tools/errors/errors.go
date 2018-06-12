package errors

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mongodb/mongo-go-driver/core/topology"
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

var alreadyExistError = gin.H{"error": "Already exist"}
var internalServerError = gin.H{"error": "Internal server error"}

/* GinError es un error que se serializa utilizando Handle
 * Si se desea definir un error personalizado como se serializa
 * Ver unauthorizedError
 */
type GinError interface {
	Handle(c *gin.Context)
}

// NewValidationErrorError un error de validación para un solo field
func NewValidationErrorError(field string, err string) error {
	result := make(validator.ValidationErrors)

	result[field] = &validator.FieldError{
		Field: field,
		Tag:   err,
	}

	return result
}

// HandleError handle any error and output JSON
func HandleError(c *gin.Context, err interface{}) {
	if ve, ok := err.(validator.ValidationErrors); ok {
		handleValidationError(c, ve)
		return
	}

	customError, ok := err.(GinError)
	if ok {
		customError.Handle(c)
		return
	}

	if err == topology.ErrServerSelectionTimeout {
		c.JSON(500, internalServerError)
		return
	}

	simpleError, ok := err.(error)
	if ok {
		if IsUniqueKeyError(simpleError) {
			c.JSON(400, alreadyExistError)

		} else {
			c.JSON(500, gin.H{
				"error": simpleError.Error(),
			})
		}
		return
	}

	c.JSON(500, internalServerError)
}

// IsDuplicateKeyError retorna true si el error es de indice unico
func IsUniqueKeyError(err error) bool {
	return strings.Contains(err.Error(), "duplicate key error")
}

func handleValidationError(c *gin.Context, validationErrors validator.ValidationErrors) {
	var result []pathMessage

	for _, err := range validationErrors {
		result = append(result, pathMessage{
			Path:    strings.ToLower(err.Field),
			Message: err.Tag,
		})
	}

	c.JSON(400, gin.H{
		"messages": result,
	})
}

type pathMessage struct {
	Path    string `json:"path"`
	Message string `json:"message"`
}
