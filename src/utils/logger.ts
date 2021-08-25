import { isObject } from "./common";

const logger = console;

type LogType = "loading" | "success" | "error" | "unknown" | "create" | "update" | "delete";

const emojiMap: Record<LogType, string> = {
  delete: "🗑",
  create: "🧱",
  error: "🔥",
  loading: "⏳",
  success: "🎉",
  unknown: "🤷‍",
  update: "✏️",
};

const logCaption = (type: LogType, title: string) => `${emojiMap[type]} ${title}`;

function plain(data: unknown): void {
  if (isObject(data)) {
    logger.dir(data, { depth: null, colors: true });
    return;
  }

  logger.log(data);
}

function message(type: LogType, logMessage: string, data?: unknown): void {
  const formattedTitle = logCaption(type, logMessage);

  const totalChars = (process.stdout.columns || 150) - formattedTitle.length - 3;
  const separators = "=".repeat(totalChars / 2);

  logger.log("\n%s\n", `${separators} ${formattedTitle} ${separators}`);

  if (data) {
    logger.dir(data, { depth: null, colors: true });
  }
}

const log = {
  message,
  plain,
};

export default log;
