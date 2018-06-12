package db

import (
	"auth/tools/config"
	"context"
	"log"
	"time"

	"github.com/mongodb/mongo-go-driver/core/topology"
	"github.com/mongodb/mongo-go-driver/mongo"
)

var database *mongo.Database

// Database returns the database
func Database() (*mongo.Database, error) {
	if database == nil {
		client, err := mongo.NewClientWithOptions(
			config.Environment().MongoUrl,
			mongo.ClientOpt.ServerSelectionTimeout(time.Second),
		)
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
	if err == topology.ErrServerSelectionTimeout {
		database = nil
	}
}
