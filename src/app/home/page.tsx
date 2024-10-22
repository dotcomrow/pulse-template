import MapCard from "@component/map/MapCard";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

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
    <div className="columns-2 flex">
      <div className="w-2/3 flex">
        <MapCard />
      </div>
      <div className="w-1/3 flex flex-col">
        <div>
          <Card className="py-4 w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              open requests near you
            </CardBody>
          </Card>
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
