import React from "react";
import {Pagination, PaginationItem, PaginationCursor} from "@nextui-org/pagination";
import { useAppSelector, useAppStore } from "@hook/redux";
import { selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";

export default function PaginationBar() {

    const store = useAppStore();
    const [page, setPage] = React.useState(1);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: string = useAppSelector(selectPictureRequestStatus);
    

    return (
        <div className="w-full pb-5 px-2 flex justify-center">
            <Pagination
                page={page}
                onChange={(page) => setPage(page)}
                total={100}
                size="lg"
            />
        </div>
    )
}