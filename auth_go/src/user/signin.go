package user

import (
	"github.com/gin-gonic/gin"

	"auth/token"
	"auth/tools/rest"
)

// SignIn is the controller to sign in users
func SignIn(c *gin.Context) {
	login := signInRequest{}

	if err := c.ShouldBindJSON(&login); err != nil {
		rest.HandleError(c, err)
		return
	}

	user, err := findUserByLogin(login.Login)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = user.validatePassword(login.Password)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	tokenString, err := token.CreateToken(user.ID())
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"token": tokenString,
	})
}

type signInRequest struct {
	Password string `json:"password" binding:"required"`
	Login    string `json:"login" binding:"required"`
}
