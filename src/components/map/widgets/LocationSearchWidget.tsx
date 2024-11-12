import { Input } from "@nextui-org/input";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Tooltip } from "@nextui-org/tooltip";
import React from "react";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Spinner } from "@nextui-org/spinner";
import { findAddress } from "@services/map/findAddress";
import "@styles/map/location-search-control.css";

export default function LocationSearchWidget(centerMap: any) {

    const [searchLoading, setSearchLoading] = React.useState<boolean>(false);
    const [query, setQuery] = React.useState<string>("");
    const [open, setOpen] = React.useState<boolean>(false);
    const [searchDisabled, setSearchDisabled] = React.useState<boolean>(true);
    const [items, setItems] = React.useState<any[]>([]);

    const searchHandler = (e: any) => {
        if (searchDisabled || query === "") {
            setOpen(false);
            return;
        }
        setSearchLoading(true);
        findAddress(query).then((results) => {
            const searchResults = Array.isArray(results) ? results : [];
            if (searchResults.length == 0) {
                setItems([{ display_name: "No results found" }]);
            } else {
                setItems(searchResults);
            }
            setQuery("");
            setOpen(true);
            setSearchDisabled(true);
            setSearchLoading(false);
        });
    };

    return (
        <Input
            isClearable
            value={query}
            type="text"
            placeholder="Enter a location"
            labelPlacement="outside"
            className="w-full z-20"
            onChange={(e) => {
                setQuery(e.target.value);
                if (query.length > 0) {
                    setSearchDisabled(false);
                } else {
                    setSearchDisabled(true);
                }
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    searchHandler(e);
                }
            }}
            endContent={searchLoading ? <Spinner size="md" /> : <></>}
            startContent={
                <Popover
                    placement="bottom-start"
                    isOpen={open}
                    onOpenChange={(e) => {
                        setOpen(e);
                    }}
                    classNames={{
                        content: [
                            "items-start",
                            "flex"
                        ]
                    }}>
                    <PopoverTrigger>
                        <div className="shrink-0">
                            <Tooltip content={searchDisabled ? "Enter a point of interest to find" : "Click this icon or press enter to search"}>
                                <Image
                                    src="/assets/images/icons/search.svg"
                                    width={35}
                                    height={35}
                                    shadow="sm"
                                    onClick={searchHandler}
                                    style={{
                                        cursor: searchDisabled ? "default" : "pointer",
                                        padding: "0.5rem",
                                    }}
                                    alt="Click to move map to current location"
                                />
                            </Tooltip>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        {items.map((item) => (
                            <Link
                                href="#"
                                onMouseOver={(e: any) => {
                                    e.currentTarget.style.backgroundColor = '#0008ff'
                                    e.currentTarget.style.color = '#FFFFFF'
                                }}
                                onMouseOut={(e: any) => {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF'
                                    e.currentTarget.style.color = '#0008ff'
                                }}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!item.lon || !item.lat) {
                                        setOpen(false);
                                        return;
                                    }
                                    setQuery("");
                                    setSearchDisabled(true);
                                    centerMap.centerMap({ coords: { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) } });
                                    setItems([]);
                                    setOpen(false);
                                }}>
                                <h2 className="w-full">{item.display_name}</h2>
                            </Link>
                        ))}
                    </PopoverContent>
                </Popover>
            }
        />
    )
}