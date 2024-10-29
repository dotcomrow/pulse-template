import MapCard from "@component/map/cards/MapCard";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { headers, cookies } from 'next/headers'
import LogUtility from "@utils/LoggingUtility";
import ActivityNearYouCard from "@component/map/cards/ActivityNearYouCard";

export const runtime = 'edge';

export default async function Home() {

  // await LogUtility.logEntry(await LogUtility.buildLogContext(), [
  //   {
  //     severity: "INFO",
  //     jsonPayload: {
  //       message: "App Request",
  //       // context: getRequestContext(),
  //       headers: await headers(),
  //     },
  //   }
  // ]);

  const headersList = await headers();
  const cookieStore = await cookies()
  return (
    <div className="columns-2 flex gap-2 h-full">
      <div className="w-2/3 flex">
        <MapCard initialPosition={{
          coords: {
            latitude: parseFloat(headersList.get('x-vercel-ip-latitude') ?? '0'),
            longitude: parseFloat(headersList.get('x-vercel-ip-longitude') ?? '0'),
          }
        }} token={cookieStore.get('token')?.value || ''} />
      </div>
      <div className="w-1/3 flex flex-col gap-3">
        <div>
          <ActivityNearYouCard />
        </div>
        <div>
          <Card className="py-4 w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              popular locations
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
