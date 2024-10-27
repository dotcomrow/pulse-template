import { Tabs, Tab } from "@nextui-org/tabs";
import { Checkbox } from "@nextui-org/checkbox";
import { useState } from "react";
import CompassWidget from "./CompassWidget";

export default function RequestSubmit({ geomString }: { geomString: string }) {

    const [compassDirectionEnabled, setCompassDirectionEnabled] = useState(false);
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
                <Tab key="details" title="Details">
                    <Checkbox
                        isSelected={compassDirectionEnabled}
                        onValueChange={(e) => {
                            setCompassDirectionEnabled(e);
                        }}>Verify Compass Direction</Checkbox>
                    <div className="flex flex-col" id="compass">
                        <CompassWidget  />
                    </div>
                </Tab>
                <Tab key="description" title="Description">

                </Tab>
                <Tab key="payment" title="Payment">

                </Tab>
            </Tabs>
        </div>
    );
}