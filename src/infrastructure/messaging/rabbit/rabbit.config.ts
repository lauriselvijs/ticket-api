const {
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_DEFAULT_USER,
  RABBITMQ_DEFAULT_PASS,
} = process.env;

if (
  !RABBITMQ_HOST ||
  !RABBITMQ_PORT ||
  !RABBITMQ_DEFAULT_USER ||
  !RABBITMQ_DEFAULT_PASS
) {
  throw new Error("Missing required RabbitMQ environment variables");
}

export const rabbitConfig = {
  host: RABBITMQ_HOST,
  port: RABBITMQ_PORT,
  user: RABBITMQ_DEFAULT_USER,
  pass: RABBITMQ_DEFAULT_PASS,
  url: `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`,
};
