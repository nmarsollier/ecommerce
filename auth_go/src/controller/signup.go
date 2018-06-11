package controller

import (
	"auth/tools/rest"
	"auth/user"

	"github.com/gin-gonic/gin"
)

// SignUp is the controller to signup new users
func SignUp(c *gin.Context) {
	userRequest := user.NewUserRequest{}

	if err := c.ShouldBindJSON(&userRequest); err != nil {
		rest.HandleError(c, err)
		return
	}

	token, err := user.SignUp(userRequest)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})

}
