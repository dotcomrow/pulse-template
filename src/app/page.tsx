
import { headers } from 'next/headers'
import { getRequestContext } from "@cloudflare/next-on-pages";
import { default as LogUtility } from "@utils/LoggingUtility";
import Layout from "@component/layout/Layout";

export const runtime = 'edge';

export default async function Home() {

  await LogUtility.logEntry(await LogUtility.buildLogContext(), [
    {
      severity: "INFO",
      jsonPayload: {
        message: "App Request",
        context: getRequestContext(),
        headers: headers(),
      },
    }
  ]);

  return (
    <Layout />
  );
}
