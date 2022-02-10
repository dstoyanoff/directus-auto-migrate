import { DiffResult, GenerateQueryResult, State } from "../types/core";
export declare const generateUpdates: (diffResults: Record<keyof State["data"], DiffResult<unknown>[]>) => string[];
export default function createUpdateQueries(dbState: State["data"], fileState: State["data"]): GenerateQueryResult;
//# sourceMappingURL=create-update-queries.d.ts.map