import React from "react";
import {Pagination, PaginationItem, PaginationCursor} from "@nextui-org/pagination";
import { useAppSelector, useAppStore } from "@hook/redux";

export default function PaginationBar() {

    const store = useAppStore();
    const [page, setPage] = React.useState(1);

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