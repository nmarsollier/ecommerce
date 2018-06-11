package controller

import (
	"auth/token"
	"auth/tools/rest"

	"github.com/gin-gonic/gin"
)

// SignOut is the sign out controller
func SignOut(c *gin.Context) {
	err := token.InvalidateToken(c)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.Done()
}
