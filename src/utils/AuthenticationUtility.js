import { init } from "@lib/db_init";
import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/d1";
import { ConsoleLogWriter, eq } from "drizzle-orm";
import { getRequestContext } from "@cloudflare/next-on-pages";

export default {
  async fetchAccountInfo(token) {

    const db = drizzle(getRequestContext().env.CACHE);
    const account_token_cache = sqliteTable("account_token_cache", {
      token: text("token").notNull(),
      profile: text('profile', { mode: 'json' }).notNull(),
      profile_expiry: numeric("profile_expiry").notNull(),
    });
    var res = undefined;
    try {
      res = await db
        .select()
        .from(account_token_cache)
        .where(eq(account_token_cache.token, token));
    } catch (error) {
      await init(process.env);
      res = await db
        .select()
        .from(account_token_cache)
        .where(eq(account_token_cache.token, token));
    }

    if (res.length > 0) {
      if (res[0].profile_expiry < Date.now()) {
        await db
          .delete(account_token_cache)
          .where(eq(account_token_cache.token, token));
        var accountInfo = await this.fetchProfile(token);
        if (accountInfo == undefined) {
          return undefined;
        } else {
          await db
            .insert(account_token_cache)
            .values({
              token: token,
              profile: JSON.stringify(accountInfo),
              profile_expiry: Date.now() + 3600000,
            });
          return accountInfo;
        }
      } else {
        return JSON.parse(res[0].profile);
      }
    } else {
      var accountInfo = await this.fetchProfile(token);
        if (accountInfo == undefined) {
          return undefined;
        } else {
          await db
            .insert(account_token_cache)
            .values({
              token: token,
              profile: JSON.stringify(accountInfo),
              profile_expiry: Date.now() + 3600000,
            });
          return accountInfo;
        }
    }
  },

  async fetchProfile(token) {
    const googleProfileUrl =
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
      token;

    var response = await fetch(googleProfileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    var accountResponse = JSON.parse(await response.text());
    if (accountResponse == undefined || accountResponse["id"] == undefined) {
      return undefined;
    }

    return accountResponse;
  }
}
