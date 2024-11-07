import { Checkbox } from "@nextui-org/react";
import { useState } from "react";


export default function RequestsHeader() {

    const [trackLocation, setTrackLocation] = useState(true);

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