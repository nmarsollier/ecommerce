package token

import (
	"auth/tools/db"
	"context"
	"fmt"
	"strings"

	validator "gopkg.in/go-playground/validator.v8"

	"github.com/mongodb/mongo-go-driver/bson"
	"github.com/mongodb/mongo-go-driver/bson/objectid"
	"github.com/mongodb/mongo-go-driver/mongo"
)

func tokenCollection() (*mongo.Collection, error) {
	db, err := db.Database()
	if err != nil {
		return nil, err
	}

	collection := db.Collection("tokens")

	_, err = collection.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys: bson.NewDocument(
				bson.EC.String("userId", ""),
			),
			Options: bson.NewDocument(),
		},
	)
	if err != nil {
		fmt.Print(err.Error())
	}

	return db.Collection("tokens"), nil
}

// Save agrega un token a la base de datos
func saveToken(token Token) (Token, error) {
	if err := validateTokenSchema(token); err != nil {
		return token, err
	}

	collection, err := tokenCollection()
	if err != nil {
		db.HandleConnectionError(err)
		return token, err
	}

	if len(token.ID()) > 0 {
		_id, _ := objectid.FromHex(token.ID())

		_, err := collection.UpdateOne(context.Background(),
			bson.NewDocument(bson.EC.ObjectID("_id", _id)),
			bson.NewDocument(
				bson.EC.SubDocumentFromElements("$set",
					bson.EC.Boolean("enabled", token.Enabled),
				),
			))

		if err != nil {
			db.HandleConnectionError(err)
			return token, err
		}
	} else {
		res, err := collection.InsertOne(context.Background(), token)
		if err != nil {
			db.HandleConnectionError(err)
			return token, err
		}

		token.SetID(res.InsertedID.(objectid.ObjectID))
	}

	return token, nil
}

func validateTokenSchema(token Token) error {
	token.UserID = strings.TrimSpace(token.UserID)

	result := make(validator.ValidationErrors)

	if len(token.ID()) > 0 {
		if _, err := objectid.FromHex(token.ID()); err != nil {
			result["id"] = &validator.FieldError{
				Field: "id",
				Tag:   "Invalid",
			}
		}
	}
	if len(token.UserID) == 0 {
		result["userId"] = &validator.FieldError{
			Field: "userId",
			Tag:   "Requerido",
		}
	} else {
		if _, err := objectid.FromHex(token.UserID); err != nil {
			result["userId"] = &validator.FieldError{
				Field: "userId",
				Tag:   "Invalid",
			}
		}
	}

	if len(result) > 0 {
		return result
	}

	return nil
}

func findTokenByID(tokenID string) (*Token, error) {
	_id, err := getTokenID(tokenID)
	if err != nil {
		return nil, UnauthorizedError
	}

	collection, err := tokenCollection()
	if err != nil {
		db.HandleConnectionError(err)
		return nil, err
	}

	result := bson.NewDocument()
	filter := bson.NewDocument(bson.EC.ObjectID("_id", *_id))
	err = collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		db.HandleConnectionError(err)
		if err == mongo.ErrNoDocuments {
			return nil, UnauthorizedError
		} else {
			return nil, err
		}
	}

	token := newTokenFromBson(*result)

	return &token, nil
}

func findTokenByUserID(tokenID string) (*Token, error) {
	_id, err := getTokenID(tokenID)
	if err != nil {
		return nil, UnauthorizedError
	}

	collection, err := tokenCollection()
	if err != nil {
		db.HandleConnectionError(err)
		return nil, err
	}

	result := bson.NewDocument()

	filter := bson.NewDocument(
		bson.EC.String("userId", _id.Hex()),
		bson.EC.Boolean("enabled", true),
	)
	err = collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		db.HandleConnectionError(err)
		if err == mongo.ErrNoDocuments {
			return nil, UnauthorizedError
		} else {
			return nil, err
		}
	}

	token := newTokenFromBson(*result)

	return &token, nil
}

func deleteToken(tokenID string) error {
	token, err := findTokenByID(tokenID)
	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	token.Enabled = false
	_, err = saveToken(*token)

	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	return nil
}

func getTokenID(ID string) (*objectid.ObjectID, error) {
	result, err := objectid.FromHex(ID)
	if err != nil {
		vError := make(validator.ValidationErrors)

		vError["id"] = &validator.FieldError{
			Field: "id",
			Tag:   "Invalid",
		}

		return nil, vError
	}
	return &result, nil
}
