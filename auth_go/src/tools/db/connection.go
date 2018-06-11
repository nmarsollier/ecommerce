package db

import (
	"context"
	"log"

	"github.com/mongodb/mongo-go-driver/mongo"
)

var database *mongo.Database

// Database returns the database
func Database() (*mongo.Database, error) {
	if database == nil {
		client, err := mongo.NewClient("mongodb://localhost:27017")
		if err != nil {
			log.Fatal(err)
			return nil, err
		}
		err = client.Connect(context.TODO())
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		database = client.Database("auth2")
	}
	return database, nil
}

// HandleConnectionError función a llamar cuando se produce un error de db
func HandleConnectionError(err error) {
	log.Print(err)
	// database = nil
}
