declare type LogType = "loading" | "success" | "error" | "unknown" | "create" | "update" | "delete";
declare function plain(data: unknown): void;
declare function message(type: LogType, logMessage: string, data?: unknown): void;
declare const log: {
    message: typeof message;
    plain: typeof plain;
};
export default log;
//# sourceMappingURL=logger.d.ts.map