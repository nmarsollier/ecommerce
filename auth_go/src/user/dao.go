package user

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

// UsersCollection obtiene la colección de Usuarios
func userCollection() (*mongo.Collection, error) {
	database, err := db.Database()
	if err != nil {
		return nil, err
	}

	collection := database.Collection("users")

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
		db.HandleConnectionError(err)
		fmt.Print(err.Error())
	}

	return collection, nil
}

func saveUser(user User) (User, error) {
	if err := validateUserSchema(user); err != nil {
		return user, err
	}

	collection, err := userCollection()
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

func validateUserSchema(user User) error {
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
func findUserByID(userID string) (*User, error) {
	_id, err := objectid.FromHex(userID)
	if err != nil {
		return nil, InvalidUserIdError
	}

	collection, err := userCollection()
	if err != nil {
		db.HandleConnectionError(err)
		return nil, err
	}

	result := bson.NewDocument()
	filter := bson.NewDocument(bson.EC.ObjectID("_id", _id))
	err = collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		db.HandleConnectionError(err)
		if err == mongo.ErrNoDocuments {
			return nil, InvalidUserIdError
		} else {
			return nil, err
		}
	}

	user := newUserFromBson(*result)

	return &user, nil
}

// FindByLogin lee un usuario desde la db
func findUserByLogin(login string) (*User, error) {
	collection, collectionError := userCollection()
	if collectionError != nil {
		db.HandleConnectionError(collectionError)
		return nil, collectionError
	}

	result := bson.NewDocument()
	filter := bson.NewDocument(bson.EC.String("login", login))
	err := collection.FindOne(context.Background(), filter).Decode(result)
	if err != nil {
		db.HandleConnectionError(err)
		if err == mongo.ErrNoDocuments {
			return nil, InvalidLoginError
		} else {
			return nil, err
		}
	}

	user := newUserFromBson(*result)

	return &user, nil
}

// Delete marca un usuario como borrado en la base de datos
func deleteUser(userID string) error {
	_id, err := getUserID(userID)
	if err != nil {
		return err
	}

	collection, err := userCollection()
	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	user := newUser()
	user.Enabled = false
	filter := bson.NewDocument(bson.EC.ObjectID("_id", *_id))

	_, err = collection.UpdateOne(context.Background(), filter, user)
	if err != nil {
		db.HandleConnectionError(err)
		return err
	}

	return nil
}

func getUserID(ID string) (*objectid.ObjectID, error) {
	_id, err := objectid.FromHex(ID)
	if err != nil {
		return nil, InvalidUserIdError
	}
	return &_id, nil
}
