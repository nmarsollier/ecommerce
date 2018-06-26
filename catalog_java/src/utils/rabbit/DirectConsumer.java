package utils.rabbit;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import utils.server.Environment;
import utils.validator.Validator;

/**
 * Escuchar en una cola direct es recibir un mensaje directo,
 * Necesitamos un exchange y un queue especifico para enviar correctamente el mensaje.
 * Tanto el consumer como el publisher deben compartir estos mismos datos.
 */
public class DirectConsumer {
    private String exchange;
    private String queue;
    private Map<String, EventProcessor> listeners = new HashMap<>();

    public DirectConsumer(String exchange, String queue) {
        this.exchange = exchange;
        this.queue = queue;
    }

    public void addProcessor(String event, EventProcessor listener) {
        listeners.put(event, listener);
    }

    /**
     * En caso de desconexión se conectara nuevamente en 10 segundos
     */
    public void startDelayed() {
        new java.util.Timer().schedule(new java.util.TimerTask() {
            @Override
            public void run() {
                start();
            }
        }, 10 * 1000); // En 10 segundos reintenta.
    }

    /**
     * Conecta a rabbit para escuchar eventos
     */
    public void start() {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost(Environment.getEnv().rabbitServerUrl);
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();

            channel.exchangeDeclare(exchange, "direct");
            channel.queueDeclare(queue, false, false, false, null);

            channel.queueBind(queue, exchange, queue);

            new Thread(() -> {
                try {
                    Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ Escuchando " + queue);

                    channel.basicConsume(queue, true, new EventConsumer(channel));
                } catch (Exception e) {
                    Logger.getLogger("RabbitMQ").log(Level.SEVERE, "RabbitMQ ", e);
                    startDelayed();
                }
            }).start();
        } catch (Exception e) {
            Logger.getLogger("RabbitMQ").log(Level.SEVERE, "RabbitMQ ", e);
            startDelayed();
        }
    }

    class EventConsumer extends DefaultConsumer {
        EventConsumer(Channel channel) {
            super(channel);
        }

        @Override
        public void handleDelivery(String consumerTag, //
                Envelope envelope, //
                AMQP.BasicProperties properties, //
                byte[] body) {
            try {
                RabbitEvent event = RabbitEvent.fromJson(new String(body));
                Validator.validate(event);

                EventProcessor l = listeners.get(event.type);
                if(l != null) {
                    Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ Consume article-data : " + event.type);

                    l.process(event);
                }
            } catch (Exception e) {
                Logger.getLogger("RabbitMQ").log(Level.SEVERE, "RabbitMQ ", e);
            }
        }
    };
}
