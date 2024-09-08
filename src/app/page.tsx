import { default as DB } from "@lib/DB";
import { default as AuthenticationUtility } from "@utils/AuthenticationUtility";
import { getRequestContext } from "@cloudflare/next-on-pages";
import Login from "@component/login/Login";
import { cookies } from 'next/headers'

export const runtime = 'edge';

export default async function Home() {
  const cookieStore = cookies()
  var auth = cookieStore.get('token')?.value

  if (auth) {
    var accountResponse = await AuthenticationUtility.fetchAccountInfo(auth);
    if (accountResponse == undefined) {
      return (
        <div>
          <h1>Unauthorized</h1>
        </div>
      );
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
