package rabbit

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/streadway/amqp"
)

var channel *amqp.Channel

type Message struct {
	Type    string `json:"type"`
	Message string `json:"message"`
}

func getChannel() (*amqp.Channel, error) {
	if channel == nil {
		conn, err := amqp.Dial("amqp://localhost")
		if err != nil {
			return nil, err
		}

		ch, err := conn.Channel()
		if err != nil {
			return nil, err
		}
		channel = ch
	}
	if channel == nil {
		return nil, errors.New("Channel not initialized")
	}
	return channel, nil
}

/**
 * @api {fanout} auth/fanout Invalidar Token
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription AuthService enviá un broadcast a todos los usuarios cuando un token ha sido invalidado. Los clientes deben eliminar de sus caches las sesiones invalidadas.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{Token revocado}"
 *     }
 */
func SendLogout(token string) error {
	message := Message{
		Type:    "logout",
		Message: token,
	}

	chanel, err := getChannel()
	if err != nil {
		return err
	}

	err = chanel.ExchangeDeclare(
		"auth",   // name
		"fanout", // type
		false,    // durable
		false,    // auto-deleted
		false,    // internal
		false,    // no-wait
		nil,      // arguments
	)
	if err != nil {
		return err
	}

	body, err := json.Marshal(message)
	if err != nil {
		return err
	}

	err = chanel.Publish(
		"auth", // exchange
		"",     // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			Body: []byte(body),
		})
	if err != nil {
		return err
	}

	log.Output(1, "Rabbit logout enviado")
	return nil
}
