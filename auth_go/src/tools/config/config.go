package config

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type Configuration struct {
	Port      int    `json:"port"`
	RabbitUrl string `json:"rabbitUrl"`
	MongoUrl  string `json:"mongoUrl"`
}

var defaultConfig = Configuration{
	Port:      3000,
	RabbitUrl: "amqp://localhost",
	MongoUrl:  "mongodb://localhost:27017",
}

var config Configuration
var initialized = false

func Environment() Configuration {
	if !initialized {
		config = defaultConfig

		if file, err := os.Open("config.json"); err == nil {
			err = json.NewDecoder(file).Decode(&config)
			if err != nil {
				log.Output(1, fmt.Sprintf("Error al leer archivo config.xml : %s", err.Error()))
			}
		} else {
			log.Output(1, "No se encontró el archivo de configuraion config.json")
		}

		initialized = true
	}

	return config
}
