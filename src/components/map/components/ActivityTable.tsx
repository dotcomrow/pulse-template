"use client";

import { useAppSelector, useAppStore } from "@hook/redux";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset, selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import React, { useEffect } from "react";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { Image } from "@nextui-org/image";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { selectDeviceLocation } from "@lib/features/location/deviceLocationSlice";

export default function ActivityTable({

}: {

    }) {

    const store = useAppStore();
    const [page, setPage] = React.useState(1);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const deviceLocationState: any = useAppSelector(selectDeviceLocation);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);

    function getDistanceFromLatLonInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 3958.8; // Radius of the Earth in miles
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    useEffect(() => {

    }, [pictureRequestsState, pictureRequestStatus, limitSelect, offsetSelect]);

    const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="w-full">
            {children}
        </div>
    );

    const requestDescription = (request: Feature) => {
        return (
            <>
                <div className="w-full">
                    <h3>{request.getProperties().request_description}</h3>
                    <p className="w-full">Request Date/Time: {new Date(request.getProperties().capture_timestamp).toLocaleDateString(navigator.language) + " " + new Date(request.getProperties().capture_timestamp).toLocaleTimeString(navigator.language)}</p>
                    <p className="w-full">Request Bid: {request.getProperties().bid_type}</p>
                    <p className="w-full">Distance: {getDistanceFromLatLonInMiles(
                        deviceLocationState.latitude, 
                        deviceLocationState.longitude, 
                        (request.getGeometry() as Point)?.getCoordinates()[1],
                        (request.getGeometry() as Point)?.getCoordinates()[0]
                        ).toFixed(4)} miles</p>
                </div>
            </>
        );
    }

    return (
        <ListboxWrapper>
            <Listbox variant="flat" aria-label="Listbox menu with sections">
                <ListboxSection>
                    {pictureRequestsState.map((request: Feature) => (
                        <ListboxItem
                            key={request.getId() ?? "0"}
                            title={request.getProperties().request_title}
                            description={requestDescription(request)}
                            textValue={request.getProperties().request_title}
                            startContent={
                                <>
                                    <div className="lg:hidden max-lg:flex">
                                        <Image
                                            src="/assets/images/icons/camera.svg"
                                            alt="Camera Icon"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="max-lg:hidden lg:flex">
                                        <Image
                                            src="/assets/images/icons/camera.svg"
                                            alt="Camera Icon"
                                            width={25}
                                            height={25}
                                        />
                                    </div>
                                </>
                            }
                        >
                            {request.getProperties().request_title}
                        </ListboxItem>
                    ))}
                </ListboxSection>
            </Listbox>
        </ListboxWrapper>
    );
}