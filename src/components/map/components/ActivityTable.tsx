"use client";

import { useAppSelector } from "@hook/redux";
import { selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import React, { useEffect, useMemo } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Image } from "@nextui-org/image";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { selectDeviceLocation } from "@lib/features/location/deviceLocationSlice";
import { Spinner } from "@nextui-org/spinner";
import "@styles/activityTable/iconImage.css"

export default function ActivityTable({

}: {

    }) {

    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: string = useAppSelector(selectPictureRequestStatus);
    const deviceLocationState: any = useAppSelector(selectDeviceLocation);

    const getDistance = (item: Feature) => {
        return (
            <>
                {getDistanceFromLatLonInMiles(
                    deviceLocationState.latitude,
                    deviceLocationState.longitude,
                    (item.getGeometry() as Point)?.getCoordinates()[1],
                    (item.getGeometry() as Point)?.getCoordinates()[0]
                ).toFixed(4)}
            </>
        );
    }

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

    const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="w-full">
            {children}
        </div>
    );

    return (
        pictureRequestStatus == "loading" ? (
            <div className="w-full flex justify-center items-center">
                <Spinner
                    size="lg"
                    color="primary"
                />
            </div>
        ) : (
            <ListboxWrapper>
                <Listbox
                    variant="flat"
                    aria-label="Listbox menu with sections"
                    items={pictureRequestsState}
                >
                    {(item: Feature) => (
                        <ListboxItem
                            key={item.getId() ?? 'default-key'}
                            title={item.getProperties().request_title}
                            description={
                                <div className="w-full">
                                    <h3>{item.getProperties().request_description}</h3>
                                    <p className="w-full">Request Date/Time: {new Date(item.getProperties().capture_timestamp).toLocaleDateString(navigator.language) + " " + new Date(item.getProperties().capture_timestamp).toLocaleTimeString(navigator.language)}</p>
                                    <p className="w-full">Request Bid: {item.getProperties().bid_type}</p>
                                    <p className="w-full">Distance: <span id={"distance-" + item.getId()}>{getDistance(item)}</span> miles</p>
                                </div>
                            }
                            textValue={item.getProperties().request_title}
                            startContent={
                                <>
                                    <div className="icon-background-small max-lg:hidden lg:flex" />
                                    <div className="icon-background-large lg:hidden max-lg:flex" />
                                </>
                            }
                        >
                            {item.getProperties().request_title}
                        </ListboxItem>
                    )}
                </Listbox>
            </ListboxWrapper>
        )
    );
}