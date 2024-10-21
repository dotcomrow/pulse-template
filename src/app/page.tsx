
import { headers } from 'next/headers'
import { getRequestContext } from "@cloudflare/next-on-pages";
import { default as LogUtility } from "@utils/LoggingUtility";

export const runtime = 'edge';

export default async function Home() {

  // await LogUtility.logEntry(await LogUtility.buildLogContext(), [
  //   {
  //     severity: "INFO",
  //     jsonPayload: {
  //       message: "App Request",
  //       context: getRequestContext(),
  //       headers: headers(),
  //     },
  //   }
  // ]);

  return (
    <div>
      <h1>Homepage</h1>
    </div>
  );
}
