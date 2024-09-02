import { headers } from "next/headers";
import { init } from "@lib/db_init";
import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { default as AuthenticationUtility } from "@utils/AuthenticationUtility.js";

export const runtime = 'edge';

export default async function Home() {
  
  const headersList = headers()
  const auth = headersList.get('Authorization')

  if (auth) {
    const db = drizzle(process.env.CACHE);
    const page_cache = sqliteTable("page_cache", {
      page_id: text("page_id").notNull(),
      object_id: text("object_id").notNull(),
      account_id: text("account_id").notNull(),
      response: text('response', { mode: 'json' }).notNull(),
      last_update_datetime: numeric("last_update_datetime").notNull(),
    });
    var accountResponse = await AuthenticationUtility.fetchAccountInfo(auth);
    if (accountResponse == undefined) {
      return (
        <div>
          <h1>Unauthorized</h1>
        </div>
      );
    }
    var res: { page_id: string; object_id: string; account_id: string; response: unknown; last_update_datetime: string; }[] = [];
    try {
      res = await db
        .select()
        .from(page_cache)
        .where(eq(page_cache.account_id, accountResponse["id"]));
    } catch (error) {
      await init(process.env);
      res = await db
        .select()
        .from(page_cache)
        .where(eq(page_cache.account_id, accountResponse["id"]));
    }
    return (
      <div>
        <h1>Hello World</h1>
        {res.map((item) => (
          <div key={item.page_id}>
            <p>Page ID: {item.page_id}</p>
            <p>Object ID: {item.object_id}</p>
            <p>Account ID: {item.account_id}</p>
            <p>Last Update: {item.last_update_datetime}</p>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }
}
