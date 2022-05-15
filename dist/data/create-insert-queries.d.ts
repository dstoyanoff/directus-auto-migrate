import { GenerateQueryResult, State } from "../types/core";
export declare const generateInserts: ({ collections, fields, permissions, presets, relations }: State["data"]) => string[];
export default function createInsertQueries(dbState: State["data"], fileState: State["data"]): GenerateQueryResult;
//# sourceMappingURL=create-insert-queries.d.ts.map