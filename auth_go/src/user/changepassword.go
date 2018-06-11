package user

import (
	"auth/token"
	"auth/tools/rest"

	"github.com/gin-gonic/gin"
)

// ChangePassword Change Password Controller
func ChangePassword(c *gin.Context) {
	payload, err := token.ValidateToken(c)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	body := changePasswordRequest{}

	if err := c.ShouldBindJSON(&body); err != nil {
		rest.HandleError(c, err)
		return
	}

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	user, err := findUserByID(payload.UserID)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = user.validatePassword(body.CurrentPassword)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = user.setPasswordText(body.NewPassword)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	_, err = saveUser(*user)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.Done()
}

type changePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required"`
}
