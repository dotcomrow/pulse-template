import MapCard from "@component/map/cards/MapCard";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { headers, cookies } from 'next/headers'
import LogUtility from "@utils/LoggingUtility";
import ActivityNearYouCard from "@component/map/cards/ActivityNearYouCard";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";

export const runtime = 'edge';

export default async function Map() {

  const cookieStore = await cookies();
  return (
    <>
      {/* // <!-- Desktop view --> */}
      <div className="px-3 pt-3 columns-2 gap-2 h-full flex max-lg:hidden">
        <div className="w-2/3 flex h-full">
          <Card className="py-2 mb-auto flex h-full w-full">
            <CardBody className="overflow-visible flex w-full">
              <MapCard
                token={cookieStore.get('token')?.value || ''}
                mapTarget="mapDesktop"
              />
            </CardBody>
          </Card>
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
      {/* // <!-- Mobile view --> */}
      <div className="h-full lg:hidden flex mb-auto">
        <MapCard
          token={cookieStore.get('token')?.value || ''}
          mapTarget="mapMobile"
        />
      </div>
    </>
  );
}
