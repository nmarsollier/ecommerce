package services

import (
	"auth/security"
	"auth/tools/rest"
	"auth/users/dao"

	"github.com/gin-gonic/gin"
)

// ChangePassword Change Password Controller
func ChangePassword(c *gin.Context) {
	payload, err := security.ValidateToken(c)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	body := changePassword{}

	if err := c.ShouldBindJSON(&body); err != nil {
		rest.HandleError(c, err)
		return
	}

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	user, err := dao.FindByID(payload.UserID)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = user.ValidatePassword(body.CurrentPassword)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	err = user.HashPassword(body.NewPassword)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	_, err = dao.Save(*user)
	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.Done()
}

type changePassword struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required"`
}
