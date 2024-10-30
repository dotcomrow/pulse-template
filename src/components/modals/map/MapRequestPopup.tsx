import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Tooltip } from "@nextui-org/tooltip";
import { Link } from "@nextui-org/link";
import RequestSubmit from "@component/map/components/RequestSubmit";
import { Image } from "@nextui-org/image";

export default function MapRequestPopup({
    closePopup,
    vectorLayer,
    token
}: {
    closePopup: any,
    vectorLayer: any,
    token: string
}) {
    return (
        <Card>
            <CardHeader className="flex-row items-center w-full flex">
                <div className="w-1/2 justify-start flex">
                    <h2 className="font-bold">Request Picture</h2>
                </div>
                <div className="w-1/2 justify-end flex">
                    <Tooltip content="Click this icon to close the request picture popup">
                        <Link href="#" onClick={closePopup}><Image 
                            src="/assets/images/icons/close.svg" 
                            alt="Close popup" 
                            width={20} 
                            height={20}
                        /></Link>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardBody>
                <div id="popup-content">
                    <RequestSubmit geomString={
                        JSON.stringify(vectorLayer?.getSource()?.getFeatureById("request")?.getGeometry()?.getCoordinates())
                    } token={token} popupClose={closePopup} />
                </div>
            </CardBody>
        </Card>
    )
}