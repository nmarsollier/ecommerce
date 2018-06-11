package controller

import (
	"auth/token"
	"auth/tools/rest"

	"github.com/gin-gonic/gin"
)

/**
 * @api {get} /auth/signout Logout
 * @apiName SignOut
 * @apiGroup Seguridad
 *
 * @apiDescription Desloguea un usuario en el sistema, invalida el token.
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
// SignOut is the sign out controller
func SignOut(c *gin.Context) {
	err := token.InvalidateToken(c)

	if err != nil {
		rest.HandleError(c, err)
		return
	}

	c.Done()
}
