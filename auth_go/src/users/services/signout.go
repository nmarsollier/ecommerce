package services

import (
	"auth/security"
	"auth/tokens/dao"
	"auth/tools/rest"

	"github.com/gin-gonic/gin"
)

// SignOut is the sign out controller
func SignOut(c *gin.Context) {
	payload, err := security.ValidateToken(c)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = dao.Delete(payload.TokenID)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.Done()
}
