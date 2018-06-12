package token

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// Unauthorized an argument is invalid
type unauthorized struct {
}

var UnauthorizedError = &unauthorized{}

func (e *unauthorized) Error() string {
	return fmt.Sprintf("Unauthorized")
}

// Handle es un error que se serializa en Gin
func (e *unauthorized) Handle(c *gin.Context) {
	c.JSON(401, gin.H{
		"error": "Unauthorized",
	})
}
