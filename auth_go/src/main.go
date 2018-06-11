package main

import (
	"auth/users/services"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()
	r.POST("/auth/password", services.ChangePassword)
	r.POST("/auth/signin", services.SignIn)
	r.POST("/auth/signout", services.SignOut)
	r.POST("/auth/signup", services.SignUp)
	r.GET("/auth/currentUser", services.CurrentUser)
	r.Run(":3005")
}
