import { default as DB } from "@lib/DB";
import { eq } from "drizzle-orm";
import { getRequestContext } from "@cloudflare/next-on-pages";

export default {
  async fetchAccountInfo(token) {
    var res: { [x: string]: any; }[] = [];
    try {
      res = await DB.databases(getRequestContext().env).CACHE
        .select()
        .from(DB.tables.account_token_cache)
        .where(eq(DB.tables.account_token_cache.token, token));
    } catch (error) {
      await DB.init(getRequestContext().env);
      res = await DB.databases(getRequestContext().env).CACHE
        .select()
        .from(DB.tables.account_token_cache)
        .where(eq(DB.tables.account_token_cache.token, token));
    }

    if (res.length > 0) {
      if (res[0].profile_expiry < Date.now()) {
        await DB.databases(getRequestContext().env).CACHE
          .delete(DB.tables.account_token_cache)
          .where(eq(DB.tables.account_token_cache.token, token));
        var accountInfo = await this.fetchProfile(token);
        if (accountInfo == undefined) {
          return undefined;
        } else {
          await DB.databases(getRequestContext().env).CACHE
            .insert(DB.tables.account_token_cache)
            .values({
              token: token,
              profile: JSON.stringify(accountInfo),
              profile_expiry: (Date.now() + 3600000).toString(),
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
          await DB.databases(getRequestContext().env).CACHE
            .insert(DB.tables.account_token_cache)
            .values({
              token: token,
              profile: JSON.stringify(accountInfo),
              profile_expiry: (Date.now() + 3600000).toString(),
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
