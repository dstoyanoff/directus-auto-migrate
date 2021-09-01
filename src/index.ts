#!/usr/bin/env npx ts-node

import yargs from "yargs/yargs";
import { initDb } from "./database/connect";
import migrate from "./migrate";
import { CLIOptions } from "./types/cli";

yargs(process.argv.slice(2)).command<CLIOptions>(
  "$0 <name>",
  "Generate a migration from your current instance state",
  yargs =>
    yargs
      .option("envFile", {
        type: "string",
        describe: "Path to .env file",
        default: ".env",
      })
      .option("stateFile", {
        type: "string",
        describe: "Path to the state file in your project",
        default: "directus-state.json",
      })
      .option("migrationsDir", {
        type: "string",
        describe: "Location to generate the migration file",
        default: "src/migrations",
      })
      .option("format", {
        type: "string",
        describe: "typescript/javascript",
        default: "javascript",
      })
      .option("preview", {
        type: "boolean",
        describe:
          "Execute the diff, but don't write to the file-system. !!Exception: if this is the first run of the script, the state file will be created!!",
        default: false,
      }),
  async argv => {
    initDb(argv.envFile);

    await migrate(argv);

    process.exit(0);
  }
).argv;
