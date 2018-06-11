package errors

import (
	"github.com/gin-gonic/gin"
	validator "gopkg.in/go-playground/validator.v8"
)

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
