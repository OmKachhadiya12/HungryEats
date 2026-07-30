import amqp from "amqplib";
let channel;
export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBIT_MQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(process.env.PAYMENT_QUEUE, {
        durable: true,
    });
    console.log("RabbitMQ connected successfully(Restaurant service).");
};
export const getChannel = () => channel;
