import mongoose from "mongoose";

let isConnected = false;

export const connectMongo = async (uri: string) => {
  if (!isConnected) {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("✅ Mongo connected");
  }
};

export const closeMongo = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✅ Mongo disconnected");
  }
};
