import { headers } from "next/headers";
import { default as DB } from "@lib/DB";
import { eq } from "drizzle-orm";
import { default as AuthenticationUtility } from "@utils/AuthenticationUtility";
import { getRequestContext } from "@cloudflare/next-on-pages";
import Login from "@component/login/Login";
import { cookies } from 'next/headers'

export const runtime = 'edge';

export default async function Home() {

  const headersList = headers()
  var auth = headersList.get('Authorization')?.split(' ')[1];

  if (!auth) {
    const cookieStore = cookies()
    auth = cookieStore.get('token')?.value
  }

  if (auth) {
    
    
    var accountResponse = await AuthenticationUtility.fetchAccountInfo(auth);
    if (accountResponse == undefined) {
      return (
        <div>
          <h1>Unauthorized</h1>
        </div>
      );
    }
    var res: { [x: string]: any; }[] = [];
    try {
      res = await DB.databases(getRequestContext().env).CACHE
        .select()
        .from(DB.tables.page_cache)
        .where(eq(DB.tables.page_cache.account_id, accountResponse["id"]));
    } catch (error) {
      await DB.init(getRequestContext().env);
      res = await DB.databases(getRequestContext().env).CACHE
        .select()
        .from(DB.tables.page_cache)
        .where(eq(DB.tables.page_cache.account_id, accountResponse["id"]));
    }
    return (
      <div>
        <h1>Hello World</h1>
        <div>
          <h2>Account Info</h2>
          <p>Account ID: {accountResponse["id"]}</p>
          <p>Account Name: {accountResponse["name"]}</p>
          <p>Account Email: {accountResponse["email"]}</p>
        </div>
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
        <Login>Login object</Login>
      </div>
    );
  }
}
