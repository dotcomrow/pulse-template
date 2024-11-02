import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

import { Spinner } from "@nextui-org/spinner";
import { Pagination, PaginationItem, PaginationCursor } from "@nextui-org/pagination";
import {
    selectPictureRequests,
    selectPictureRequestStatus,
    selectLimit,
    selectOffset
} from "@lib/features/map/mapSlice";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import ActivityTable from "@component/map/components/ActivityTable";

export default function ActivityNearYouCard({
    initialPosition,
    token
}: {
    initialPosition: { coords: { latitude: number, longitude: number } },
    token: string
}) {
    return (
        <Card className="py-4 w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="flex-row w-full flex justify-start">
                    <h2 className="text-2xl font-bold pb-3">Nearby Requests</h2>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div>
                    <ActivityTable 
                        initialPosition={initialPosition}
                        token={token}
                    />
                </div>
            </CardBody>
        </Card>
    );
}