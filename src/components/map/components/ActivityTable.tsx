"use client";

import { useAppSelector, useAppStore } from "@hook/redux";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset, selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import React, { useEffect } from "react";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { Image } from "@nextui-org/image";
import Feature from "ol/Feature";
import { selectInitialLocation } from "@lib/features/location/locationSlice";

export default function ActivityTable({
    token
}: {
    token: string
}) {

    const store = useAppStore();
    const [page, setPage] = React.useState(1);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const initialLocationState: any = useAppSelector(selectInitialLocation);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);
    const latitudeInitialWidth = 0.0064373;
    const longitudeInitialWidth = 0.00786198;

    useEffect(() => {

    }, [pictureRequestsState, pictureRequestStatus, limitSelect, offsetSelect]);

    // useEffect(() => {
    //     const bbox: BoundingBox = {
    //         min_latitude: initialLocationState.longitude - (latitudeInitialWidth / 2),
    //         min_longitude: initialLocationState.latitude - (longitudeInitialWidth / 2),
    //         max_latitude: initialLocationState.longitude + (latitudeInitialWidth / 2),
    //         max_longitude: initialLocationState.latitude + (longitudeInitialWidth / 2),
    //     };
    //     store.dispatch(loadPictureRequests(bbox, limitSelect, offsetSelect));
    // }, []);

    const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="w-full border-small border-default-200 dark:border-default-100">
            {children}
        </div>
    );

    const requestDescription = (request: Feature) => {
        return (
            <div>
                <h3>{request.getProperties().request_description}</h3>
                <p>{request.getProperties().capture_timestamp}</p>
                <p>{request.getProperties().bid_type}</p>
                <p>{request.getProperties().direction}</p>
                <p>Distance: </p>
            </div>
        );
    }

    return (
        <ListboxWrapper>
            <Listbox variant="flat" aria-label="Listbox menu with sections">
                <ListboxSection title="Requests Nearby" showDivider>
                    {pictureRequestsState.map((request: Feature) => (
                        <ListboxItem
                            key={request.getId() ?? "0"}
                            title={request.getProperties().request_title}
                            description={requestDescription(request)}
                            textValue={request.getProperties().request_title}
                            startContent={
                                <Image
                                    src="/assets/images/icons/camera.svg"
                                    alt="Camera Icon"
                                    width={50}
                                    height={50}
                                />
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