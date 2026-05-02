import amqplib from "amqplib";
import { connectToRabbit, getRabbitChannel } from "./rabbit.connection.ts";
import { RABBIT_EXCHANGES } from "./rabbit.constants.ts";

export const publishToRabbit = async (
  routingKey: string,
  message: object,
  opts: amqplib.Options.Publish = {},
): Promise<void> => {
  await connectToRabbit();

  const channel = getRabbitChannel();
  const payload = Buffer.from(JSON.stringify(message));

  await new Promise<void>((resolve, reject) => {
    const ok = channel.publish(
      RABBIT_EXCHANGES.TICKETS,
      routingKey,
      payload,
      {
        ...opts,
        persistent: true,
        contentType: "application/json",
        timestamp: Date.now(),
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      },
    );

    if (!ok) {
      channel.once("drain", () => {
        console.warn("Buffer drained, can resume publishing");
      });
    }
  });
};
