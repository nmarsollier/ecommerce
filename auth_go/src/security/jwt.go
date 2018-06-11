package security

import (
	tokenD "auth/tokens/dao"
	"auth/tokens/schema"
	"auth/tools/errors/unauthorized"
	"fmt"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var hmacSampleSecret = []byte("ecb6d3479ac3823f1da7f314d871989b")

type Payload struct {
	TokenID string
	UserID  string
}

// CreateToken crea un token
func CreateToken(token schema.Token) (string, error) {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"tokenID": token.ID(),
		"userID":  token.UserID,
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := jwtToken.SignedString(hmacSampleSecret)

	return tokenString, err
}

// ValidateToken valida un token
func ValidateToken(c *gin.Context) (*Payload, error) {
	tokenString := c.GetHeader("Authorization")

	if strings.Index(tokenString, "bearer ") != 0 {
		return nil, unauthorized.New()
	}

	tokenString = tokenString[7:]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return hmacSampleSecret, nil
	})

	if err != nil {
		return nil, unauthorized.New()
	}

	if !token.Valid {
		return nil, unauthorized.New()
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return nil, unauthorized.New()
	}

	payload := Payload{
		UserID:  claims["userID"].(string),
		TokenID: claims["tokenID"].(string),
	}

	dbToken, err := tokenD.FindByID(payload.TokenID)

	if err != nil {
		return nil, unauthorized.New()
	}

	if !dbToken.Enabled {
		return nil, unauthorized.New()
	}

	return &payload, nil
}
