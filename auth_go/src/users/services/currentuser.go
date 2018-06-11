package services

import (
	"auth/security"
	"auth/tools/rest"
	userD "auth/users/dao"

	"github.com/gin-gonic/gin"
)

// CurrentUser is the controller to get the current logged in user
func CurrentUser(c *gin.Context) {
	payload, err := security.ValidateToken(c)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	user, err := userD.FindByID(payload.UserID)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"id":    user.ID(),
		"name":  user.Name,
		"roles": user.Roles,
		"login": user.Login,
	})
}
