import { readFileSync } from "node:fs";
import { Agent } from "node:https";
import { resolve } from "node:path";
import type { AxiosRequestConfig } from "axios";

export function getApiRequestConfig(): AxiosRequestConfig {
  const certificatePath = process.env.API_CA_CERT_PATH;
  if (!certificatePath) return {};

  return {
    httpsAgent: new Agent({
      ca: readFileSync(resolve(process.cwd(), certificatePath), "utf8"),
    }),
  };
}