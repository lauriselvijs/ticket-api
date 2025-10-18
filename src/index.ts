import express from "express";
import { connectToMongo } from "./config/mongo.ts";
import { middleware } from "./middleware/index.ts";
import { routes } from "./routes/index.ts";
import { config } from "./config/express.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

config(app);
routes(app);
middleware(app);

connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
