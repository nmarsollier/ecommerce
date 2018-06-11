package unauthorized

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// Unauthorized an argument is invalid
type Unauthorized struct {
}

// New Creates new invalid property error
func New() *Unauthorized {
	return &Unauthorized{}
}

func (e *Unauthorized) Error() string {
	return fmt.Sprintf("Unauthorized")
}

// Handle es un error que se serializa en Gin
func (e *Unauthorized) Handle(c *gin.Context) {
	c.JSON(401, gin.H{
		"error": "Unauthorized",
	})
}
