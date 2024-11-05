"use client";

import { useAppSelector, useAppStore } from "@hook/redux";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset, selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import React, { useEffect } from "react";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { Image } from "@nextui-org/image";
import Feature from "ol/Feature";
import { selectInitialLocation } from "@lib/features/location/locationSlice";

export default function ActivityTable({

}: {

    }) {

    const store = useAppStore();
    const [page, setPage] = React.useState(1);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const initialLocationState: any = useAppSelector(selectInitialLocation);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);

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
                <div className="flex max-lg:hidden">
                    <h3>{request.getProperties().request_description}</h3>
                    <p>{request.getProperties().capture_timestamp}</p>
                    <p>{request.getProperties().bid_type}</p>
                    <p>{request.getProperties().direction}</p>
                    <p>Distance: </p>
                </div>
                <div className="hidden max-lg:flex">
                    <h3>{request.getProperties().request_description}</h3>
                    <p>{request.getProperties().capture_timestamp}</p>
                    <p>{request.getProperties().bid_type}</p>
                    <p>{request.getProperties().direction}</p>
                    <p>Distance: </p>
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
                                    <div className="max-lg:hidden">
                                        <Image
                                            src="/assets/images/icons/camera.svg"
                                            alt="Camera Icon"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="hidden max-lg:flex">
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