import { default as AuthenticationUtility } from "@utils/AuthenticationUtility";
import Login from "@component/login/Login";
import { cookies } from 'next/headers'
import { getRequestContext } from "@cloudflare/next-on-pages";
import { default as LogUtility } from "@utils/LoggingUtility";

export const runtime = 'edge';

export default async function Home() {
  const cookieStore = cookies()
  var auth = cookieStore.get('token')?.value

  LogUtility.logEntry(LogUtility.buildLogContext(), [
    {
      severity: "INFO",
      jsonPayload: {
        message: "App Request",
        context: getRequestContext()
      },
    }
  ]);

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
