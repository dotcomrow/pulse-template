"use client";

import ActivityTable from "@component/map/components/ActivityTable";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default async function Requests() {

    const [trackLocation, setTrackLocation] = useState(false);

    useEffect(() => {
        console.log("Requests page loaded");
    }, []);
    
    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold pb-3 pt-2 px-3">Nearby Requests</h2>
                <div>
                    <Checkbox
                        name="trackLocation"
                        isSelected={trackLocation}
                        onValueChange={(e) => {
                            // setTrackLocation(e);
                            console.log("Track Location: " + e);
                        }}>Track My Location</Checkbox>
                </div>
            </div>
            <ActivityTable />
        </div>
    );
}