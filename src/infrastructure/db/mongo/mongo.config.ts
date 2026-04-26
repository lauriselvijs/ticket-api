const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_INITDB_DATABASE,
  NODE_ENV,
} = process.env;

const isDev = NODE_ENV === "development" || NODE_ENV === "test";

if (!MONGO_HOST || !MONGO_PORT || !MONGO_INITDB_DATABASE) {
  throw new Error("Missing MongoDB environment variables");
}

if (!isDev && (!MONGO_INITDB_ROOT_USERNAME || !MONGO_INITDB_ROOT_PASSWORD)) {
  throw new Error("Missing MongoDB credentials");
}

const credentials = !isDev
  ? `${MONGO_INITDB_ROOT_USERNAME!}:${MONGO_INITDB_ROOT_PASSWORD!}@`
  : "";

const authParams = !isDev ? "&authSource=admin" : "";

export const mongoConfig = {
  host: MONGO_HOST,
  port: MONGO_PORT,
  user: MONGO_INITDB_ROOT_USERNAME,
  pass: MONGO_INITDB_ROOT_PASSWORD,
  database: MONGO_INITDB_DATABASE,
  uri: `mongodb://${credentials}${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}?replicaSet=rs0${authParams}`,
};
