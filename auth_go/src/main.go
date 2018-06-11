package main

import (
	"auth/user"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()
	r.POST("/auth/password", user.ChangePassword)
	r.POST("/auth/signin", user.SignIn)
	r.GET("/auth/signout", user.SignOut)
	r.POST("/auth/signup", user.SignUp)
	r.GET("/auth/currentUser", user.CurrentUser)
	r.Run(":3005")
}
