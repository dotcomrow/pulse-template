"use client";

import { useAppSelector, useAppStore } from "@hook/redux";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset, selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import React, { useCallback, useEffect } from "react";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { Image } from "@nextui-org/image";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { selectDeviceLocation } from "@lib/features/location/deviceLocationSlice";
import { Spinner } from "@nextui-org/spinner";
import Geometry from "ol/geom/Geometry";

export default function ActivityTable({

}: {

    }) {

    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: string = useAppSelector(selectPictureRequestStatus);
    const [listItems, setListItems] = React.useState<Feature<Geometry>[]>([]);
    const deviceLocationState: any = useAppSelector(selectDeviceLocation);    

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

    }, [pictureRequestsState]);

    useEffect(() => {
        const items = listItems;
        var changed = false;
        pictureRequestsState.map((request: Feature<Geometry>) => {
            var found = false;
            items.map((item: Feature<Geometry>) => {
                if (request.getId() == item.getId()) {
                    found = true;
                }
            });
            if (!found) {
                items.push(request);
                changed = true;
            }
        });
        if (changed) {
            setListItems(items);
        }
    }, [pictureRequestsState]);

    const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="w-full">
            {children}
        </div>
    );

    const getDistance = (request: Feature) => {
        return (
            <>
                {getDistanceFromLatLonInMiles(
                    deviceLocationState.latitude,
                    deviceLocationState.longitude,
                    (request.getGeometry() as Point)?.getCoordinates()[1],
                    (request.getGeometry() as Point)?.getCoordinates()[0]
                ).toFixed(4)}
            </>
        );
    }

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
                    items={listItems}
                >
                    {(request: Feature) => (
                        <ListboxItem
                            key={request.getId() ?? "0"}
                            title={request.getProperties().request_title}
                            description={
                                <div className="w-full">
                                    <h3>{request.getProperties().request_description}</h3>
                                    <p className="w-full">Request Date/Time: {new Date(request.getProperties().capture_timestamp).toLocaleDateString(navigator.language) + " " + new Date(request.getProperties().capture_timestamp).toLocaleTimeString(navigator.language)}</p>
                                    <p className="w-full">Request Bid: {request.getProperties().bid_type}</p>
                                    <p className="w-full">Distance: {getDistance(request)} miles</p>
                                </div>
                            }
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
                    )}
                </Listbox>
            </ListboxWrapper>
        )
    );
}