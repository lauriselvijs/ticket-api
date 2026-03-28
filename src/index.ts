import { createApp } from "./app.ts";
import { connectMongo } from "./infrastructure/persistence/mongo/mongo.connection.ts";
import { mongoConfig } from "./infrastructure/persistence/mongo/mongo.config.ts";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await connectMongo(mongoConfig.uri);

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application", error);
    process.exit(1);
  }
}

start();
