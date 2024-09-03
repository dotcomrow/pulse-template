import { GCPLogger } from "npm-gcp-logging";
import { v4 as uuidv4 } from "uuid";
import { GCPAccessToken } from "npm-gcp-token";
import { getRequestContext } from "@cloudflare/next-on-pages";

export default {
  async buildLogContext() {
    var context = {
      ENVIRONMENT: getRequestContext().env.ENVIRONMENT,
      GCP_LOGGING_PROJECT_ID: getRequestContext().env.GCP_LOGGING_PROJECT_ID,
      LOGGING_TOKEN: await new GCPAccessToken(getRequestContext().env.GCP_LOGGING_CREDENTIALS).getAccessToken("https://www.googleapis.com/auth/logging.write"),
      LOG_NAME: getRequestContext().env.LOG_NAME,
      SpanId: uuidv4(),
      VERSION: getRequestContext().env.VERSION,
    }
    return context;
  },
  async logEntry(context, entries) {
    console.log(context);
    var finalEntries = [];
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
