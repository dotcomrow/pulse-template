"use client";

import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox } from "ol/loadingstrategy.js";
import { Style, Fill, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
// import { createRoot } from 'react-dom/client';
import React, { ReactElement, Suspense, useEffect, useMemo } from "react";
import { useGeographic } from "ol/proj.js";
import { Image } from "@nextui-org/image";
import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/autocomplete";
import { findAddress } from "./findAddress";
import { Input } from "@nextui-org/input";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/button";
import Link from "next/link";

export default function MapCard({ initialPosition }: { initialPosition: { coords: { latitude: number, longitude: number } } }) {

    const [mounted, setMounted] = React.useState(false);
    const [items, setItems] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const map = useMemo(() => {
        if (mounted) {
            var mp = new Map({
                // the map will be created using the 'map-root' ref
                target: "map-container",
                layers: [
                    // adding a background tiled layer
                    new TileLayer({
                        source: new OSM(), // tiles are served by OpenStreetMap
                    }),
                    // buildVectorLayer()
                ],
                // the map view will initially show the whole world
                view: new View({
                    zoom: 17,
                    maxZoom: 18,
                    minZoom: 16,
                    constrainResolution: true,
                }),
                // overlays: [
                //     new Overlay({
                //         element: buildPopup(),
                //         autoPan: true,
                //     }),
                // ],
            });
            return mp;
        }
    }, [mounted]);

    const SearchIcon = ({
        size = 24,
        strokeWidth = 1.5,
        ...props
    }) => (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size}
            role="presentation"
            viewBox="0 0 24 24"
            width={size}
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
        </svg>
    );

    // const buildPopup = () => {
    //     const container = document.getElementById('popup-container');
    //     if (container) {
    //         const root = createRoot(container);
    //         root.render(`<div class="popup">
    //             <h3 className="header"></h3>
    //             <p className="description"></p>
    //             <p><a href="#" className="moreInfo">More info</a></p>
    //           </div>`);
    //         return container;
    //     } else {
    //         console.error('Popup container not found');
    //     }
    // };


    // const buildVectorLayer = () => {
    //     var params = JSON.parse(localStorage.getItem('user-token'));
    //     if (params) {
    //         const vectorSource = new VectorSource({
    //             format: new GeoJSON(),
    //             loader: function (extent, _resolution, _projection, success, failure) {
    //                 vectorSource.removeLoadedExtent(extent);
    //                 const url = "https://api.suncoast.systems/features?bbox=" + extent.join(',');
    //                 const xhr = new XMLHttpRequest();
    //                 xhr.open("GET", url);
    //                 xhr.setRequestHeader("Authorization", "Bearer " + params['id_token']);
    //                 const onError = function () {
    //                     vectorSource.removeLoadedExtent(extent);
    //                     failure();
    //                 };
    //                 xhr.onerror = onError;
    //                 xhr.onload = function () {
    //                     if (xhr.status === 200) {
    //                         const features = vectorSource
    //                             .getFormat()
    //                             .readFeatures(xhr.responseText);
    //                         vectorSource.addFeatures(features);
    //                         success(features);
    //                     } else {
    //                         onError();
    //                     }
    //                 };
    //                 xhr.send();
    //             },
    //             strategy: bbox,
    //             overlaps: false,
    //         });

    //         return new VectorLayer({
    //             source: vectorSource,
    //             style: new Style({
    //                 fill: new Fill({
    //                     color: "rgba(255,255,255,0.2)",
    //                 }),
    //                 stroke: new Stroke({
    //                     color: "rgba(0,0,255,0.3)",
    //                 }),
    //             }),
    //             maxZoom: 14,
    //             minZoom: 8,
    //         });
    //     } else {
    //         return new VectorLayer({
    //             source: new VectorSource()
    //         });
    //     }
    // };

    useEffect(() => {
        if (map) {
            const mapSize = map?.getSize();
            if (mapSize) {
                map?.getView().centerOn([initialPosition.coords.longitude, initialPosition.coords.latitude], mapSize, [mapSize[0] / 2, mapSize[1] / 2]);
            }
        }
    }, [mounted]);

    useEffect(() => {
        useGeographic();
        setMounted(true);
    }, []);

    return (
        <Card className="py-4 mb-auto h-full w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <Image src="/assets/images/icons/location.svg" width={40} height={40} />


                <Input
                    type="text"
                    placeholder="Enter a location"
                    labelPlacement="outside"
                    fullWidth={true}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                />
                <Popover placement="bottom-start">
                    <PopoverTrigger>
                        <Button variant="flat" className="capitalize" onClick={async (e) => {
                            setIsLoading(true);
                            const results = await findAddress(query);
                            setItems(Array.isArray(results) ? results : []);
                            setIsLoading(false);
                        }}>
                            Search
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px]">
                        {items.map((item) => (
                            <Link href="#" onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const mapSize = map?.getSize();
                                if (mapSize) {
                                    map?.getView().centerOn([parseFloat(item.lon), parseFloat(item.lat)], mapSize, [mapSize[0] / 2, mapSize[1] / 2]);
                                }
                                setItems([]);
                            }}>{item.display_name}</Link>
                        ))}
                    </PopoverContent>
                </Popover>

{/* 

                    onSelectionChange={(place_id) => {
                        const selectedItem = items.find(item => item.place_id == place_id);
                        if (selectedItem) {
                            const mapSize = map?.getSize();
                            if (mapSize) {
                                map?.getView().centerOn([parseFloat(selectedItem.lon), parseFloat(selectedItem.lat)], mapSize, [mapSize[0] / 2, mapSize[1] / 2]);
                            }
                        }
                        setItems([]);
                    }}
                    onInputChange={(value) => {
                        setQuery(value);
                    }}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            setIsLoading(true);
                            const results = await findAddress(query);
                            setItems(Array.isArray(results) ? results : []);
                            setIsLoading(false);
                            var keyboardEvent = document.createEvent('KeyboardEvent');
                            var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';

                            (keyboardEvent as any)[initMethod](
                                'keydown', // event type: keydown, keyup, keypress
                                true, // bubbles
                                true, // cancelable
                                window, // view: should be window
                                false, // ctrlKey
                                true, // altKey
                                false, // shiftKey
                                false, // metaKey
                                25, // keyCode: unsigned long - the virtual key code, else 0
                                0, // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
                            );
                            document.dispatchEvent(keyboardEvent);
                        }
                    }}
                    menuTrigger="manual"
                    onClear={() => {
                        setItems([]);
                    }}
                >
                    {(item) => (
                        <AutocompleteItem key={item.place_id} className="capitalize" textValue={item.display_name}>
                            {item.display_name}
                        </AutocompleteItem>
                    )}
                </Autocomplete> */}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="bg-white p-dynamic h-full">
                    <div id="map-container" className="h-full"></div>
                    <div id="popup-container"></div>
                </div>
            </CardBody>
        </Card>
    )
}