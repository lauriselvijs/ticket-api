import { before, beforeEach, after } from "node:test";
import {
  getMongoConnection,
  connectMongo,
} from "../../src/infrastructure/persistence/mongo/mongo.connection.ts";
import { mongoConfig } from "../../src/infrastructure/persistence/mongo/mongo.config.ts";

before(async () => {
  await connectMongo(mongoConfig.uri);
});

beforeEach(async () => {
  await getMongoConnection().db?.dropDatabase();
});

after(async () => {
  await getMongoConnection().close();
});
