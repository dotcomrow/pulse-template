import { Tabs, Tab } from "@nextui-org/tabs";
import { Checkbox } from "@nextui-org/checkbox";
import { useEffect, useState } from "react";
import CompassWidget from "./CompassWidget";
import {DateInput} from "@nextui-org/date-input";
import {parseZonedDateTime, parseAbsolute} from "@internationalized/date";

export default function RequestSubmit({ geomString }: { geomString: string }) {
    
    const [compassDirectionEnabled, setCompassDirectionEnabled] = useState(true);
    const [direction, setDirection] = useState(0);
    const [requestDate, setRequestDate] = useState(parseAbsolute(new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone));

    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
                <Tab key="details" title="Details">
                    <Checkbox
                        isSelected={compassDirectionEnabled}
                        onValueChange={(e) => {
                            setCompassDirectionEnabled(e);
                            if (!e) {
                                document.getElementById("compass")?.classList.add("hidden");
                            } else {
                                document.getElementById("compass")?.classList.remove("hidden");
                            }
                        }}>Verify Compass Direction</Checkbox>
                    <div className="flex flex-col" id="compass">
                        <CompassWidget direction={direction} setDirection={setDirection}/>
                        <DateInput 
                            label={"Picture date/time"} 
                            value={requestDate} 
                            className="max-w-sm" 
                        />
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