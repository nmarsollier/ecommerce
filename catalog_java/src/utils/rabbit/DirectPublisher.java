package utils.rabbit;

import java.util.logging.Level;
import java.util.logging.Logger;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import utils.server.Environment;

public class DirectPublisher {

    public static void publish(String exchange, String queue, RabbitEvent message) {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost(Environment.getEnv().rabbitServerUrl);
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();

            channel.exchangeDeclare(exchange, "direct");
            channel.queueDeclare(queue, false, false, false, null);

            channel.queueBind(queue, exchange, queue);

            channel.basicPublish(exchange, queue, null, message.toJson().getBytes());

            Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ Emit " + message.type);
        } catch (Exception e) {
            Logger.getLogger("RabbitMQ").log(Level.SEVERE, "RabbitMQ no se pudo encolar " + message.type, e);
        }
    }
}