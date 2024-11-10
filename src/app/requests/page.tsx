"use client";

import ActivityTable from "@component/map/components/ActivityTable";
import PaginationBar from "@component/requests/components/PaginationBar";
import RequestsHeader from "@component/requests/components/RequestsHeader";

export default async function Requests() {

    return (
        <div className="flex-col w-full h-full flex">
            <div className="pt-2 px-3 w-full flex-col flex">
                <h2 className="text-2xl font-bold">Nearby Requests</h2>
                <div className="p-4">
                    <RequestsHeader />
                </div>
            </div>
            <div className="h-5/6 pt-1 w-full flex overflow-y-scroll">
                <ActivityTable />
            </div>
            <div className="py-1 w-full flex">
                <PaginationBar />
            </div>
        </div>
    );
}