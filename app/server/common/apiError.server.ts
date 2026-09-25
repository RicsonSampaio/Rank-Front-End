import axios from "axios";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getApiError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return { message: fallback, status: 502 };
  }

  const status = error.response?.status ?? 502;
  const payload: unknown = error.response?.data;
  if (isRecord(payload)) {
    if (typeof payload.message === "string" && payload.message.trim()) {
      return { message: payload.message, status };
    }

    if (isRecord(payload.errors)) {
      const messages = Object.values(payload.errors).flatMap((value) =>
        Array.isArray(value)
          ? value.filter((item): item is string => typeof item === "string")
          : [],
      );
      if (messages.length > 0) {
        return { message: messages.join(" "), status };
      }
    }
  }

  return { message: fallback, status };
}
