package controller

import (
	"auth/tools/errors"
	"auth/user"

	"github.com/gin-gonic/gin"
)

/**
 * @api {post} /auth/signup Registrar Usuario
 * @apiName signup
 * @apiGroup Seguridad
 *
 * @apiDescription Registra un nuevo usuario en el sistema.
 *
 * @apiParamExample {json} Body
 *    {
 *      "name": "{Nombre de Usuario}",
 *      "login": "{Login de usuario}",
 *      "password": "{Contraseña}"
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
// SignUp is the controller to signup new users
func SignUp(c *gin.Context) {
	userRequest := user.NewUserRequest{}

	if err := c.ShouldBindJSON(&userRequest); err != nil {
		errors.HandleError(c, err)
		return
	}

	token, err := user.SignUp(userRequest)

	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})

}
