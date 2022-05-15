export type CLIOptions = {
  name: string;
  stateFile: string;
  migrationsDir: string;
  format: "typescript" | "javascript";
  envFile: string;
  preview?: boolean;
  allowedDirectusTables: string;
};
