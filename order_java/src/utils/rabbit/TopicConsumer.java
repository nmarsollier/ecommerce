package utils.rabbit;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import utils.server.Environment;
import utils.validator.Validator;

/**
 * La cola topic permite que varios consumidores escuchen el mismo evento
 * topic es muy importante por es el evento que se va a escuchar
 * Para que un consumer escuche los eventos debe estar conectado al mismo exchange y escuchar el topic adecuado
 * queue permite distribuir la carga de los mensajes entre distintos consumers, los consumers con el mismo queue name
 * comparten la carga de procesamiento de mensajes, es importante que se defina el queue
 */
public class TopicConsumer {
    private String exchange;
    private String queue;
    private String topic;
    private Map<String, EventProcessor> listeners = new HashMap<>();

    public TopicConsumer(String exchange, String queue, String topic) {
        this.exchange = exchange;
        this.queue = queue;
        this.topic = topic;
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

            channel.exchangeDeclare(exchange, "topic");
            channel.queueDeclare(queue, false, false, false, null);
            channel.queueBind(queue, exchange, topic);

            new Thread(() -> {
                try {
                    Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ Topic Conectado");

                    Consumer consumer = new DefaultConsumer(channel) {
                        @Override
                        public void handleDelivery(String consumerTag, //
                                Envelope envelope, //
                                AMQP.BasicProperties properties, //
                                byte[] body) {
                            try {
                                RabbitEvent event = RabbitEvent.fromJson(new String(body));
                                Validator.validate(event);

                                EventProcessor eventConsumer = listeners.get(event.type);
                                if (eventConsumer != null) {
                                    Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ Consume " + event.type);

                                    eventConsumer.process(event);
                                }
                            } catch (Exception e) {
                                Logger.getLogger("RabbitMQ").log(Level.SEVERE, "RabbitMQ Logout", e);
                            }
                        }
                    };
                    channel.basicConsume(queue, true, consumer);
                } catch (Exception e) {
                    Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ ArticleValidation desconectado");
                    startDelayed();
                }
            }).start();
        } catch (Exception e) {
            Logger.getLogger("RabbitMQ").log(Level.INFO, "RabbitMQ ArticleValidation desconectado");
            startDelayed();
        }
    }
}
