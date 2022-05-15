import { GenerateQueryResult, State } from "../types/core";
export declare const generateDeletes: ({ collections, fields, permissions, presets, relations }: State["data"]) => string[];
export default function createDeleteQueries(dbState: State["data"], fileState: State["data"]): GenerateQueryResult;
//# sourceMappingURL=create-delete-queries.d.ts.map