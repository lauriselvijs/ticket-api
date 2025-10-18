import mongoose from "mongoose";
import { checkEnv } from "../util/variables.ts";

const requiredMongoVars = [
  "MONGO_INITDB_ROOT_USERNAME",
  "MONGO_INITDB_ROOT_PASSWORD",
  "MONGO_HOST",
  "MONGO_PORT",
  "MONGO_INITDB_DATABASE",
];

checkEnv(requiredMongoVars);

const USER = process.env.MONGO_INITDB_ROOT_USERNAME!;
const PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD!;
const HOST = process.env.MONGO_HOST!;
const PORT = process.env.MONGO_PORT!;
const DB_NAME = process.env.MONGO_INITDB_DATABASE!;

const uri = `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}?authSource=admin`;

let isConnected = false;

export const connectToMongo = async (): Promise<typeof mongoose> => {
  if (!isConnected) {
    await mongoose.connect(uri);
    isConnected = true;
    console.log(`✅ Connected to MongoDB: ${DB_NAME} at ${HOST}:${PORT}`);
  }
  return mongoose;
};

export const getConnection = () => {
  if (!isConnected) {
    throw new Error("MongoDB not initialized. Call connectToMongo() first.");
  }
  return mongoose.connection;
};
