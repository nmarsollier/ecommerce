package dao

import (
	"auth/tools/db"
	"auth/tools/errors"
	"auth/tools/errors/unauthorized"
	"auth/users/schema"
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

	collection := db.Collection("users")

	_, err = collection.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys: bson.NewDocument(
				bson.EC.String("login", ""),
			),
			Options: bson.NewDocument(
				bson.EC.Boolean("unique", true),
			),
		},
	)
	if err != nil {
		fmt.Print(err.Error())
	}

	return collection, nil
}

// Save agrega un usuario a la base de datos
func Save(user schema.User) (schema.User, error) {
	if err := validateSchema(user); err != nil {
		return user, err
	}

	collection, err := collection()
	if err != nil {
		db.HandleConnectionError(err)
		return user, err
	}

	if len(user.ID()) > 0 {
		_id, _ := objectid.FromHex(user.ID())

		_, err := collection.UpdateOne(context.Background(),
			bson.NewDocument(bson.EC.ObjectID("_id", _id)),
			bson.NewDocument(
				bson.EC.SubDocumentFromElements("$set",
					bson.EC.String("password", user.Password),
					bson.EC.String("name", user.Name),
					bson.EC.Boolean("enabled", user.Enabled),
				),
			))

		if err != nil {
			db.HandleConnectionError(err)
			return user, err
		}
	} else {
		res, err := collection.InsertOne(context.Background(), user)
		if err != nil {
			db.HandleConnectionError(err)
			return user, err
		}

		user.SetID(res.InsertedID.(objectid.ObjectID))
	}

	return user, nil
}

func validateSchema(user schema.User) error {
	user.Login = strings.TrimSpace(user.Login)
	user.Name = strings.TrimSpace(user.Name)
	user.Password = strings.TrimSpace(user.Password)

	result := make(validator.ValidationErrors)

	if len(user.ID()) > 0 {
		if _, err := objectid.FromHex(user.ID()); err != nil {
			result["id"] = &validator.FieldError{
				Field: "id",
				Tag:   "Invalid",
			}
		}
	}
	if len(user.Name) == 0 {
		result["name"] = &validator.FieldError{
			Field: "name",
			Tag:   "Requerido",
		}
	}
	if len(user.Password) == 0 {
		result["password"] = &validator.FieldError{
			Field: "password",
			Tag:   "Requerido",
		}
	}
	if len(user.Login) == 0 {
		result["login"] = &validator.FieldError{
			Field: "login",
			Tag:   "Requerido",
		}
	}

	if len(result) > 0 {
		return result
	} else {
		return nil
	}
}

// FindByID lee un usuario desde la db
func FindByID(userID string) (*schema.User, error) {
	_id, err := objectid.FromHex(userID)
	if err != nil {
		return nil, unauthorized.New()
	}

	collection, collectionError := collection()
	if collectionError != nil {
		db.HandleConnectionError(collectionError)
		return nil, collectionError
	}

	result := bson.NewDocument()
	filter := bson.NewDocument(bson.EC.ObjectID("_id", _id))
	err = collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		return nil, unauthorized.New()
	}

	user := schema.NewFromBson(*result)

	return &user, nil
}

// FindByLogin lee un usuario desde la db
func FindByLogin(login string) (*schema.User, error) {
	collection, collectionError := collection()
	if collectionError != nil {
		db.HandleConnectionError(collectionError)
		return nil, collectionError
	}

	result := bson.NewDocument()
	filter := bson.NewDocument(bson.EC.String("login", login))
	err := collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		return nil, errors.NewValidationErrorError("login", "Invalid")
	}

	user := schema.NewFromBson(*result)

	return &user, nil
}

// Delete marca un usuario como borrado en la base de datos
func Delete(userID string) error {
	if err := validateID(userID); err != nil {
		return err
	}
	_id, _ := objectid.FromHex(userID)

	collection, err := collection()
	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	user := schema.New()
	user.Enabled = false
	filter := bson.NewDocument(bson.EC.ObjectID("_id", _id))

	_, err = collection.UpdateOne(context.Background(), filter, user)
	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	return nil
}

func validateID(ID string) error {
	if _, err := objectid.FromHex(ID); err != nil {
		return errors.NewValidationErrorError("id", "Invalid")
	}
	return nil
}
