import { serializeError } from "serialize-error";
import { default as LogUtility } from "@utils/LoggingUtility";
import { drizzle } from "drizzle-orm/d1";
import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";

export default {
  databases: (env: any) => {
    return {
      CACHE: drizzle(env.CACHE),
    };
  },

  tables: {
    page_cache: sqliteTable("page_cache", {
      page_id: text("page_id").notNull(),
      object_id: text("object_id").notNull(),
      account_id: text("account_id").notNull(),
      response: text('response', { mode: 'json' }).notNull(),
      last_update_datetime: numeric("last_update_datetime").notNull(),
    }),

    account_token_cache: sqliteTable("account_token_cache", {
      token: text("token").notNull(),
      profile: text('profile', { mode: 'json' }).notNull(),
      profile_expiry: numeric("profile_expiry").notNull(),
    })
  },

  init: async (env: any) => {
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

      await env.CACHE
        .prepare(
          `CREATE TABLE account_groups_cache (
            token varchar(64) PRIMARY KEY,
            groups jsonb,
            profile_expiry numeric
          )`
        )
        .run();
    } catch (e) {
      await LogUtility.logEntry(await LogUtility.buildLogContext(), [
        {
          severity: "ERROR",
          jsonPayload: {
            message: "Exception occurred in creating db tables",
            error: serializeError(e),
          },
        },
      ]);
    }
  }

}
