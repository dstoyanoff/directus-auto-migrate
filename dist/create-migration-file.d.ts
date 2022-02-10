import { CLIOptions } from "./types/cli";
import { GenerateQueryResult } from "./types/core";
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
export default function createMigrationFile(name: string, destinationDir: string, format: CLIOptions["format"], schema: GenerateQueryResult, deletes: GenerateQueryResult, inserts: GenerateQueryResult, updates: GenerateQueryResult): Promise<string>;
//# sourceMappingURL=create-migration-file.d.ts.map