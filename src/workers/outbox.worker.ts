import PublishOutboxEventsUseCase from "../application/use-cases/PublishOutboxEventsUseCase.ts";
import { RabbitEventBus } from "../infrastructure/messaging/rabbit/RabbitEventBus.ts";
import { MongoOutboxRepository } from "../infrastructure/repositories/MongoOutboxRepository.ts";
import { mongoConfig } from "../infrastructure/persistence/mongo/mongo.config.ts";
import { connectMongo } from "../infrastructure/persistence/mongo/mongo.connection.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let running = true;

process.on("SIGINT", () => {
  console.log("Received SIGINT, stopping outbox worker...");
  running = false;
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, stopping outbox worker...");
  running = false;
});

async function bootstrap(): Promise<PublishOutboxEventsUseCase> {
  await connectMongo(mongoConfig.uri);
  console.log("Mongo connected");

  const outboxRepository = new MongoOutboxRepository();
  const rabbitEventBus = new RabbitEventBus();

  return new PublishOutboxEventsUseCase(outboxRepository, rabbitEventBus);
}

async function runWorker(useCase: PublishOutboxEventsUseCase): Promise<void> {
  const pollIntervalMs = Number(process.env.OUTBOX_POLL_INTERVAL_MS ?? 5000);

  while (running) {
    try {
      await useCase.execute();

      console.log("Outbox batch completed");

      await sleep(pollIntervalMs);
    } catch (error) {
      console.error("Outbox publish iteration failed", error);

      await sleep(pollIntervalMs);
    }
  }

  console.log("Outbox worker stopped");
}

async function start() {
  const useCase = await bootstrap();
  console.log("Outbox worker started");

  await runWorker(useCase);
}

start().catch((error) => {
  console.error("Outbox worker failed to start", error);
  process.exit(1);
});
