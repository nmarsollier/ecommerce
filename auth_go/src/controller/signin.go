package controller

import (
	"github.com/gin-gonic/gin"

	"auth/tools/rest"
	"auth/user"
)

/**
 * @api {post} /auth/signin Login
 * @apiName Log in
 * @apiGroup Seguridad
 *
 * @apiDescription Loguea un usuario en el sistema.
 *
 * @apiParamExample {json} Body
 *    {
 *      "login": "{Login de usuario}",
 *      "password": "{Contraseña}"
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
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
