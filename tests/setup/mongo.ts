import { before, beforeEach, after } from "node:test";
import {
  getMongoConnection,
  connectMongo,
} from "../../src/infrastructure/db/mongo/mongo.connection.ts";
import { mongoConfig } from "../../src/infrastructure/db/mongo/mongo.config.ts";

before(async () => {
  await connectMongo(mongoConfig.uri);
});

beforeEach(async () => {
  await getMongoConnection().db?.dropDatabase();
});

after(async () => {
  await getMongoConnection().close();
});
