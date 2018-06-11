package main

import (
	"auth/controller"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()
	r.POST("/auth/password", controller.ChangePassword)
	r.POST("/auth/signin", controller.SignIn)
	r.GET("/auth/signout", controller.SignOut)
	r.POST("/auth/signup", controller.SignUp)
	r.GET("/auth/currentUser", controller.CurrentUser)
	r.Run(":3000")
}
