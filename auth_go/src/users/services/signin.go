package services

import (
	"github.com/gin-gonic/gin"

	"auth/security"
	tokenD "auth/tokens/dao"
	tokenS "auth/tokens/schema"
	"auth/tools/rest"
	userD "auth/users/dao"
)

// SignIn is the controller to sign in users
func SignIn(c *gin.Context) {
	login := logIn{}

	if err := c.ShouldBindJSON(&login); err != nil {
		rest.HandleError(c, err)
		return
	}

	user, err := userD.FindByLogin(login.Login)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = user.ValidatePassword(login.Password)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	token := tokenS.New()
	token.UserID = user.ID()

	token, err = tokenD.Save(token)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	tokenString, err := security.CreateToken(token)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"token": tokenString,
	})
}

type logIn struct {
	Password string `json:"password" binding:"required"`
	Login    string `json:"login" binding:"required"`
}
