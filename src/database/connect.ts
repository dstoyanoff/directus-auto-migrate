import * as dotenv from "dotenv";
import knex, { Knex } from "knex";
import path from "path";

let dbInstance: Knex | undefined;

export function initDb(envFile: string): void {
  const { DB_CLIENT, DB_CONNECTION_STRING, DB_DATABASE, DB_FILENAME, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } =
    dotenv.config({
      path: path.resolve(process.cwd(), envFile),
    }).parsed;

  dbInstance = knex({
    client: DB_CLIENT,
    connection: DB_CONNECTION_STRING || {
      user: DB_USER,
      database: DB_DATABASE,
      password: DB_PASSWORD,
      port: +DB_PORT,
      host: DB_HOST,
      filename: DB_FILENAME,
    },
  });
}

export default function db(): Knex {
  if (!dbInstance) {
    throw new Error("Db not initialized. Please call initDb");
  }

  return dbInstance;
}
