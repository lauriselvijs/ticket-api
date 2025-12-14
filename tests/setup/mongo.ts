import { before, beforeEach, after } from "node:test";
import { connectToMongo, getConnection } from "../../src/config/mongo.ts";

before(async () => {
  await connectToMongo();
});

beforeEach(async () => {
  await getConnection().db?.dropDatabase();
});

after(async () => {
  await getConnection().close();
});
