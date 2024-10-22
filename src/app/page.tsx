
import { headers } from 'next/headers'
import { getRequestContext } from "@cloudflare/next-on-pages";
import { default as LogUtility } from "@utils/LoggingUtility";
import Link from "next/link";

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
      <Link className="primary" href="#">test</Link><br/>
      <Link className="text-blue-500" href="#">test</Link><br/>
      <Link className="text-primary-500" href="#">test</Link><br/>
      <Link className="text-blue" href="#">test</Link><br/>
      <Link className="primary" href="#">test</Link><br/>
      <Link className="nextui-primary-500" href="#">test</Link><br/>
      <Link className="main-bg-color" href="#">test</Link><br/>
      <Link className="hsl(var(--nextui-primary)" href="#">test</Link><br/>
    </div>
  );
}
