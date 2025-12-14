import { createApp } from "./app.ts";
import { connectToMongo } from "./config/mongo.ts";
import { seedTickets } from "./db/seeders/ticket.ts";

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

connectToMongo()
  .then(async () => {
    if (process.env.NODE_ENV === "development") {
      await seedTickets(50);
    }

    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
