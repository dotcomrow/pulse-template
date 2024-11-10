import React from "react";
import { Pagination, PaginationItem, PaginationCursor } from "@nextui-org/pagination";
import { useAppSelector, useAppStore } from "@hook/redux";
import { selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import Constants from "@utils/constants";

export default function PaginationBar() {

    const store = useAppStore();
    const [page, setPage] = React.useState(1);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: string = useAppSelector(selectPictureRequestStatus);

    const getListSize = (): number => {
        if (pictureRequestsState == null) {
            return 0;
        } else {
            if (pictureRequestsState.length == 0) {
                return 0;
            } else {
                return pictureRequestsState[0].total / Constants.MapRequestConstants.itemsPerPage;
            }
        }
    }

    return (
        <div className="w-full flex justify-center">
            {getListSize() > 1 && (
                <Pagination
                    page={page}
                    onChange={(page) => setPage(page)}
                    total={getListSize()}
                    size="lg"
                />
            )}
        </div>
    )
}