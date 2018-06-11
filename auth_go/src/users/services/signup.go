package services

import (
	"auth/security"
	tokenD "auth/tokens/dao"
	tokenS "auth/tokens/schema"
	"auth/tools/errors"
	"auth/tools/rest"
	"auth/users/dao"
	userS "auth/users/schema"

	"github.com/gin-gonic/gin"
)

// SignUp is the controller to signup new users
func SignUp(c *gin.Context) {
	user := newUser{}

	if err := c.ShouldBindJSON(&user); err != nil {
		rest.HandleError(c, err)
		return
	}

	newUser := userS.New()
	newUser.Login = user.Login
	newUser.Name = user.Name
	newUser.Roles = []string{"user"}
	newUser.HashPassword(user.Password)

	newUser, err := dao.Save(newUser)
	if err != nil {
		if rest.IsUniqueKeyError(err) {
			rest.HandleError(c, errors.NewValidationErrorError("login", "Ya existe"))
		} else {
			rest.HandleError(c, err)
		}
		return
	}

	newToken := tokenS.New()
	newToken.UserID = newUser.ID()
	newToken, err = tokenD.Save(newToken)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	tokenString, err := security.CreateToken(newToken)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"token": tokenString,
	})

}

type newUser struct {
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
	Login    string `json:"login" binding:"required"`
}
