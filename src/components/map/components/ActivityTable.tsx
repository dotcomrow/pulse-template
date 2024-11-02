"use client";

import { useAppSelector } from "@hook/redux";
import { selectLimit, selectOffset, selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import React, { useEffect } from "react";

export default function ActivityTable({
    initialPosition,
    token
}: {
    initialPosition: { coords: { latitude: number, longitude: number } },
    token: string
}) {

    const [page, setPage] = React.useState(1);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);

    useEffect(() => {
        console.log(pictureRequestsState);
        console.log(pictureRequestStatus);
        console.log(limitSelect);
        console.log(offsetSelect);
    }, [pictureRequestsState, pictureRequestStatus, limitSelect, offsetSelect]);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">City</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        <tr>
                            <td className="text-left py-3 px-4">Name</td>
                            <td className="text-left py-3 px-4">City</td>
                            <td className="text-left py-3 px-4">Status</td>
                            <td className="text-left py-3 px-4">Date</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}