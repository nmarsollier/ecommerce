package user

import (
	"auth/token"
	"auth/tools/errors"
	"auth/tools/rest"

	"github.com/gin-gonic/gin"
)

// SignUp is the controller to signup new users
func SignUp(c *gin.Context) {
	user := newUserRequest{}

	if err := c.ShouldBindJSON(&user); err != nil {
		rest.HandleError(c, err)
		return
	}

	newUser := newUser()
	newUser.Login = user.Login
	newUser.Name = user.Name
	newUser.Roles = []string{"user"}
	newUser.setPasswordText(user.Password)

	newUser, err := saveUser(newUser)
	if err != nil {
		if rest.IsUniqueKeyError(err) {
			rest.HandleError(c, errors.NewValidationErrorError("login", "Ya existe"))
		} else {
			rest.HandleError(c, err)
		}
		return
	}

	tokenString, err := token.CreateToken(newUser.ID())
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"token": tokenString,
	})

}

type newUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
	Login    string `json:"login" binding:"required"`
}
