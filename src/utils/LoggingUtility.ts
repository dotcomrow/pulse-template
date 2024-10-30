import { GCPLogger } from "npm-gcp-logging";
import { v4 as uuidv4 } from "uuid";
import { GCPAccessToken } from "npm-gcp-token";
import { getRequestContext } from "@cloudflare/next-on-pages";

interface CloudflareEnv {
  ENVIRONMENT: string,
  GCP_LOGGING_PROJECT_ID: string,
  GCP_LOGGING_CREDENTIALS: string,
  LOG_NAME: string,
  VERSION: string,
}
export default {
  async buildLogContext() {
    var context = {
      ENVIRONMENT: (getRequestContext().env as CloudflareEnv).ENVIRONMENT,
      GCP_LOGGING_PROJECT_ID: (getRequestContext().env as CloudflareEnv).GCP_LOGGING_PROJECT_ID,
      LOGGING_TOKEN: (await new GCPAccessToken((getRequestContext().env as CloudflareEnv).GCP_LOGGING_CREDENTIALS).getAccessToken("https://www.googleapis.com/auth/logging.write")).access_token,
      LOG_NAME: (getRequestContext().env as CloudflareEnv).LOG_NAME,
      SpanId: uuidv4(),
      VERSION: (getRequestContext().env as CloudflareEnv).VERSION,
    }
    return context;
  },
  async logEntry(context: any, entries: any) {
    var finalEntries: any[] = [];
    for (var entry of entries) {
      entry.spanId = context.SpanId;
      entry.labels = {
        environment: context.ENVIRONMENT,
        spanId: context.SpanId,
        version: context.VERSION,
      }
      finalEntries.push(entry);
    }
    await GCPLogger.logEntry(
      context.GCP_LOGGING_PROJECT_ID,
      context.LOGGING_TOKEN,
      context.LOG_NAME,
      finalEntries
    );
  }
}
