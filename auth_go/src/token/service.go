package token

import (
	"auth/rabbit"
	"fmt"
	"log"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	cache "github.com/patrickmn/go-cache"
)

var tokenCache = cache.New(60*time.Minute, 10*time.Minute)

var jwtSecret = []byte("ecb6d3479ac3823f1da7f314d871989b")

type Payload struct {
	TokenID string
	UserID  string
}

/**
 * @apiDefine TokenResponse
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "{Token de autorización}"
 *     }
 */
// CreateToken crea un token
func CreateToken(userID string) (string, error) {
	token := newToken()
	token.UserID = userID

	token, err := saveToken(token)
	if err != nil {
		return "", err
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"tokenID": token.ID(),
		"userID":  token.UserID,
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := jwtToken.SignedString(jwtSecret)

	return tokenString, err
}

/**
 * @apiDefine AuthHeader
 *
 * @apiParamExample {String} Header Autorización
 *    Authorization=bearer {token}
 *
 * @apiSuccessExample 401 Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
// ValidateToken valida un token
func ValidateToken(c *gin.Context) (*Payload, error) {
	tokenString := c.GetHeader("Authorization")
	if strings.Index(tokenString, "bearer ") != 0 {
		return nil, UnauthorizedError
	}
	tokenString = tokenString[7:]

	if found, ok := tokenCache.Get(tokenString); ok {
		if payload, ok := found.(Payload); ok {
			return &payload, nil
		}
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, UnauthorizedError
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return nil, UnauthorizedError
	}

	payload := Payload{
		UserID:  claims["userID"].(string),
		TokenID: claims["tokenID"].(string),
	}

	dbToken, err := findTokenByID(payload.TokenID)

	if err != nil {
		return nil, UnauthorizedError
	}

	if !dbToken.Enabled {
		return nil, UnauthorizedError
	}

	tokenCache.Set(tokenString, payload, cache.DefaultExpiration)

	return &payload, nil
}

// InvalidateToken valida un token
func InvalidateToken(c *gin.Context) error {
	payload, err := ValidateToken(c)
	if err != nil {
		return UnauthorizedError
	}

	tokenString := c.GetHeader("Authorization")
	err = rabbit.SendLogout(tokenString)
	if err != nil {
		log.Output(1, "Rabbit logout no se pudo enviar")
	}

	if strings.Index(tokenString, "bearer ") != 0 {
		return UnauthorizedError
	}
	tokenString = tokenString[7:]
	tokenCache.Delete(tokenString)

	err = deleteToken(payload.TokenID)
	if err != nil {
		return UnauthorizedError
	}

	return nil
}
