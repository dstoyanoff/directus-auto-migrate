import { promises as fs } from "fs";
import path from "path";
import { CLIOptions } from "./types/cli";
import { GenerateQueryResult } from "./types/core";
import log from "./utils/logger";

/**
 * Formats a migration file and writes it in the file system
 * @param name name of the migration. It will append it to the file name
 * @param destinationDir the location where the migration file should be generated
 * @param format whether to generate TS or JS migration
 * @param schema list of all schema queries to be included in the migration
 * @param deletes list of all delete queries to be included in the migration
 * @param inserts list of all insert queries to be included in the migration
 * @param updates list of all update queries to be included in the migration
 */
export default async function createMigrationFile(
  name: string,
  destinationDir: string,
  format: CLIOptions["format"],
  schema: GenerateQueryResult,
  deletes: GenerateQueryResult,
  inserts: GenerateQueryResult,
  updates: GenerateQueryResult
): Promise<string> {
  const migrationFileContent = getContent(format, schema, deletes, inserts, updates);

  try {
    await fs.mkdir(path.resolve(process.cwd(), destinationDir));
  } catch (error) {
    if (error.code != "EEXIST") {
      throw error;
    }
  }

  const fileName = await getFileName(name, destinationDir, format);

  await fs.writeFile(path.resolve(process.cwd(), fileName), migrationFileContent);

  return fileName;
}

const getFileName = async (
  migrationName: string,
  destinationDir: string,
  format: CLIOptions["format"]
): Promise<string> => {
  const date = new Date();

  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const migrationTimestamp = `${year}${month}${day}`;

  // counts all migrations with the same timestamp, so we can add the proper count suffix at the end
  const dailyMigrationsCount = (await fs.readdir(path.resolve(process.cwd(), destinationDir))).filter(file =>
    file.startsWith(migrationTimestamp)
  ).length;

  const suffix = `000${dailyMigrationsCount + 1}`.substr(-3);
  const extension = format === "javascript" ? "js" : "ts";
  const nameEscaped = migrationName.toLowerCase().replace(/ /g, "-");

  return `${destinationDir}/${migrationTimestamp}${suffix}-${nameEscaped}.${extension}`;
};

const queriesMerge = (queryCollection: string[][]): string =>
  `${queryCollection
    .map(queries => queries.join(";\\\n"))
    .filter(item => !!item)
    .join(";\\\n \\\n ")}\\`;

const getContent = (
  format: CLIOptions["format"],
  schema: GenerateQueryResult,
  deletes: GenerateQueryResult,
  inserts: GenerateQueryResult,
  updates: GenerateQueryResult
) => {
  const upQuery = queriesMerge([schema.up, deletes.up, inserts.up, updates.up]);
  const downQuery = queriesMerge([schema.down, deletes.down, inserts.down, updates.down]);

  log.message("update", "Up Query", upQuery);
  log.message("update", "Down Query", downQuery);

  if (format === "javascript") {
    return generateJSMigration(upQuery, downQuery);
  }

  return generateTSMigration(upQuery, downQuery);
};

const generateTSMigration = (up: string, down: string) => `/* eslint-disable no-irregular-whitespace */
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async transaction => {
    await transaction.raw("\\
${up}
     \\ ");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async transaction => {
    await transaction.raw("\\
${down}
    \\ ");
  });
}
`;

const generateJSMigration = (
  up: string,
  down: string
): string => `/* eslint-disable no-irregular-whitespace, no-undef */
module.exports = {
  async up(knex) {
    await knex.transaction(async (transaction) => {
      await transaction.raw("\\
${up}
    \\ ");
    });
  },
  async down(knex) {
    await knex.transaction(async (transaction) => {
      await transaction.raw("\\
${down}
      \\ ");
    });
  },
};
`;
