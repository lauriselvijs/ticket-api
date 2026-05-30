const {
  MYSQL_ROOT_PASSWORD,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
} = process.env;

if (
  !MYSQL_ROOT_PASSWORD ||
  !MYSQL_PASSWORD ||
  !MYSQL_DATABASE ||
  !MYSQL_HOST ||
  !MYSQL_PORT ||
  !MYSQL_USER
) {
  throw new Error("Missing required MySQL environment variables");
}

const isDev = process.env.NODE_ENV !== "production";

const user = isDev ? "root" : MYSQL_USER;
const pass = isDev ? MYSQL_ROOT_PASSWORD : MYSQL_PASSWORD;

export const databaseConfig = {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user,
  pass,
  database: MYSQL_DATABASE,
  url: `mysql://${user}:${encodeURIComponent(pass)}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`,
};
