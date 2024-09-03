import { serializeError } from "serialize-error";
import { default as LogUtility } from "@utils/LoggingUtility.js";

export async function init(env) {
  try {
    await env.CACHE
      .prepare(
        `CREATE TABLE page_cache (
          page_id varchar(64),
          object_id varchar(64),
          account_id varchar(64),
          response jsonb,
          last_update_datetime numeric
        )`
      )
      .run();

      await env.CACHE
      .prepare(
        `CREATE TABLE account_token_cache (
          token varchar(64) PRIMARY KEY,
          profile jsonb,
          profile_expiry numeric
        )`
      )
      .run();
  } catch (e) {
    await LogUtility.logEntry(await LogUtility.buildLogContext(), [
      {
        severity: "ERROR",
        jsonPayload: {
          message: "Exception occurred in fetch",
          error: serializeError(e),
        },
      },
    ]);
  }
}
