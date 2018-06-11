package user

import (
	"auth/tools/bsontools"
	"auth/tools/errors"

	"github.com/mongodb/mongo-go-driver/bson"
	"github.com/mongodb/mongo-go-driver/bson/objectid"
	"golang.org/x/crypto/bcrypt"
)

// User data structure
type User struct {
	_id      string
	Name     string   `bson:"name"`
	Login    string   `bson:"login"`
	Password string   `bson:"password"`
	Roles    []string `bson:"roles"`
	Enabled  bool     `bson:"enabled"`
}

func newUser() User {
	return User{Enabled: true}
}

// SetID sets the user id based on ObjectID
func (e *User) SetID(ID objectid.ObjectID) {
	e._id = ID.Hex()
}

// ID get the token ID
func (e *User) ID() string {
	return e._id
}

func newUserFromBson(document bson.Document) User {
	return User{
		_id:      bsontools.LookupObjectID(document, "_id"),
		Login:    bsontools.LookupString(document, "login"),
		Name:     bsontools.LookupString(document, "name"),
		Password: bsontools.LookupString(document, "password"),
		Enabled:  bsontools.LookupBool(document, "enable"),
		Roles:    bsontools.LookupStringArray(document, "roles"),
	}
}

func (e *User) setPasswordText(pwd string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.MinCost)
	if err != nil {
		return errors.NewValidationErrorError("password", "Invalid")
	}

	e.Password = string(hash)
	return nil
}

func (e *User) validatePassword(plainPwd string) error {
	err := bcrypt.CompareHashAndPassword([]byte(e.Password), []byte(plainPwd))

	if err != nil {
		return errors.NewValidationErrorError("password", "Invalid")
	}
	return nil
}
