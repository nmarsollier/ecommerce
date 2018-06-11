package dao

import (
	"auth/tokens/schema"
	"auth/tools/db"
	"auth/tools/errors/unauthorized"
	"context"
	"fmt"
	"strings"

	validator "gopkg.in/go-playground/validator.v8"

	"github.com/mongodb/mongo-go-driver/bson"
	"github.com/mongodb/mongo-go-driver/bson/objectid"
	"github.com/mongodb/mongo-go-driver/mongo"
)

// UsersCollection obtiene la colección de Usuarios
func collection() (*mongo.Collection, error) {
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
func Save(token schema.Token) (schema.Token, error) {
	if err := validateSchema(token); err != nil {
		return token, err
	}

	collection, err := collection()
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

func validateSchema(token schema.Token) error {
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

// FindByID lee un token desde la db
func FindByID(tokenID string) (*schema.Token, error) {
	if err := validateID(tokenID); err != nil {
		return nil, unauthorized.New()
	}
	_id, _ := objectid.FromHex(tokenID)

	collection, collectionError := collection()
	if collectionError != nil {
		db.HandleConnectionError(collectionError)
		return nil, collectionError
	}

	result := bson.NewDocument()
	filter := bson.NewDocument(bson.EC.ObjectID("_id", _id))
	err := collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		return nil, unauthorized.New()
	}

	token := schema.NewFromBson(*result)

	return &token, nil
}

// FindByUserID lee un token valido desde la db
func FindByUserID(userID string) (*schema.Token, error) {
	if err := validateID(userID); err != nil {
		return nil, unauthorized.New()
	}
	_id, _ := objectid.FromHex(userID)

	collection, collectionError := collection()
	if collectionError != nil {
		db.HandleConnectionError(collectionError)
		return nil, collectionError
	}

	result := bson.NewDocument()

	filter := bson.NewDocument(
		bson.EC.String("userId", _id.Hex()),
		bson.EC.Boolean("enabled", true),
	)
	err := collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		return nil, unauthorized.New()
	}

	token := schema.NewFromBson(*result)

	return &token, nil
}

// Delete marca un usuario como borrado en la base de datos
func Delete(tokenID string) error {

	token, err := FindByID(tokenID)
	if err := validateID(tokenID); err != nil {
		return err
	}

	token.Enabled = false
	_, err = Save(*token)

	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	return nil
}

func validateID(ID string) error {
	if _, err := objectid.FromHex(ID); err != nil {
		result := make(validator.ValidationErrors)

		result["id"] = &validator.FieldError{
			Field: "id",
			Tag:   "Invalid",
		}

		return result
	}
	return nil
}
