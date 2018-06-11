package controller

import (
	"github.com/gin-gonic/gin"

	"auth/tools/rest"
	"auth/user"
)

// SignIn is the controller to sign in users
func SignIn(c *gin.Context) {
	login := signInRequest{}

	if err := c.ShouldBindJSON(&login); err != nil {
		rest.HandleError(c, err)
		return
	}

	tokenString, err := user.SignIn(login.Login, login.Password)

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
