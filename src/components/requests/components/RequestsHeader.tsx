import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function RequestsHeader() {

    const [trackLocation, setTrackLocation] = useState(true);

    useEffect(() => {
        if (trackLocation) {
            // track location
        } else {
            // stop tracking location
        }
    }, [trackLocation]);

    return (
        <>
            <Checkbox
                id="trackLocation"
                onChange={(e) => setTrackLocation(e.target.checked)}
                isSelected={trackLocation}
                size="lg"
            >Track My Location</Checkbox>
        </>
    );
}