import amqplib from "amqplib";
import type { ChannelModel, ConfirmChannel } from "amqplib";
import { checkEnv } from "../util/variables.ts";

const requiredEnvVars = [
  "RABBIT_HOST",
  "RABBIT_PORT",
  "RABBITMQ_DEFAULT_USER",
  "RABBITMQ_DEFAULT_PASS",
];
checkEnv(requiredEnvVars);

const HOST = process.env.RABBIT_HOST!;
const PORT = process.env.RABBIT_PORT!;
const USER = process.env.RABBITMQ_DEFAULT_USER!;
const PASS = process.env.RABBITMQ_DEFAULT_PASS!;

const URL = `amqp://${USER}:${PASS}@${HOST}:${PORT}`;
const EXCHANGE = "tickets";

let rabbitConn: ChannelModel | null = null;
let rabbitChannel: ConfirmChannel | null = null;

export const connectToRabbit = async (): Promise<{
  conn: ChannelModel;
  ch: ConfirmChannel;
}> => {
  if (rabbitConn && rabbitChannel) {
    return { conn: rabbitConn, ch: rabbitChannel };
  }

  const conn = await amqplib.connect(URL);
  const ch = await conn.createConfirmChannel();

  await ch.assertExchange(EXCHANGE, "topic", { durable: true });

  conn.on("error", (e) => console.error("RabbitMQ connection error:", e));
  conn.on("close", () => console.warn("RabbitMQ connection closed"));

  rabbitConn = conn;
  rabbitChannel = ch;

  console.log(`✅ RabbitMQ connected – exchange "${EXCHANGE}" ready`);

  return { conn, ch };
};

export const publishToRabbit = async (
  routingKey: string,
  message: object | string,
  opts: amqplib.Options.Publish = {}
): Promise<void> => {
  if (!rabbitChannel) {
    await connectToRabbit();
  }
  if (!rabbitChannel) {
    throw new Error("❌ RabbitMQ channel not available after reconnect");
  }

  const payload =
    typeof message === "string" ? message : JSON.stringify(message);

  const ok = rabbitChannel.publish(EXCHANGE, routingKey, Buffer.from(payload), {
    persistent: true,
    contentType: "application/json",
    timestamp: Date.now(),
    ...opts,
  });

  if (!ok) {
    console.warn("⚠️ RabbitMQ publish buffer is full");
  } else {
    console.log(
      `📨 Published to ${EXCHANGE} with key "${routingKey}": ${payload}`
    );
  }
};

export const getRabbitConnection = (): ChannelModel => {
  if (!rabbitConn) throw new Error("❌ RabbitMQ connection not established");
  return rabbitConn;
};

export const getRabbitChannel = (): ConfirmChannel => {
  if (!rabbitChannel) throw new Error("❌ RabbitMQ channel not established");
  return rabbitChannel;
};

export const closeRabbit = async (): Promise<void> => {
  try {
    if (rabbitChannel) await rabbitChannel.close();
    if (rabbitConn) await rabbitConn.close();
  } finally {
    rabbitChannel = null;
    rabbitConn = null;
  }
};
