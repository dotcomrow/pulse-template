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
import React, { ReactElement, Suspense, useEffect, useMemo, useRef } from "react";
import { useGeographic } from "ol/proj.js";
import { Image } from "@nextui-org/image";
import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/autocomplete";
import { findAddress } from "./findAddress";
import { Input } from "@nextui-org/input";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/button";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";
import "@styles/map/spinner.css"
import { loadPictureRequests } from "@lib/features/map/mapSlice";
import { selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { debounce } from 'lodash';

export default function MapCard({ initialPosition }: { initialPosition: { coords: { latitude: number, longitude: number } } }) {

    const [mounted, setMounted] = React.useState(false);
    const [items, setItems] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const store = useAppStore();

    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures({
                type: "FeatureCollection",
                features: []
            }),
            // loader: function (extent, _resolution, _projection, success, failure) {
            //     console.log("Extent:", extent);
            //     store.dispatch(loadPictureRequests({
            //         minLat: extent[1],
            //         minLng: extent[0],
            //         maxLat: extent[3],
            //         maxLng: extent[2],
            //     }));
            // },
        }),
        style: new Style({
            fill: new Fill({
                color: "rgba(255,255,255,0.2)",
            }),
            stroke: new Stroke({
                color: "rgba(0,0,255,0.3)",
            }),
        }),
        maxZoom: 18,
        minZoom: 16,
    });

    // const buildVectorLayer = () => {
    //     const vectorSource = new VectorSource({
    //         format: new GeoJSON(),
    //         loader: async function (extent, _resolution, _projection, success, failure) {
    //             vectorSource.removeLoadedExtent(extent);
    //             const format = vectorSource?.getFormat();
    //             if (format) {
    //                 store.dispatch(loadPictureRequests({
    //                     minLat: extent[1],
    //                     minLng: extent[0],
    //                     maxLat: extent[3],
    //                     maxLng: extent[2],
    //                 }));
    //                 console.log("Picture requests:", await state.pictureRequests);
    //                 const features = format.readFeatures(state.pictureRequests);
    //                 vectorSource.addFeatures(features);
    //                 if (success) {
    //                     success(features);
    //                 }
    //             } else {
    //                 if (failure) {
    //                     failure();
    //                 }
    //             }
    //         },
    //         strategy: bbox,
    //         overlaps: false,
    //     });

    //     return new VectorLayer({
    //         source: vectorSource,
    //         style: new Style({
    //             fill: new Fill({
    //                 color: "rgba(255,255,255,0.2)",
    //             }),
    //             stroke: new Stroke({
    //                 color: "rgba(0,0,255,0.3)",
    //             }),
    //         }),
    //         maxZoom: 18,
    //         minZoom: 16,
    //     });
    //     // return new VectorLayer({
    //     //     source: new VectorSource()
    //     // });
    // };

    const map = useMemo(() => {
        if (mounted) {
            var map = new Map({
                // the map will be created using the 'map-root' ref
                target: "map-container",
                layers: [
                    // adding a background tiled layer
                    new TileLayer({
                        source: new OSM(), // tiles are served by OpenStreetMap
                    }),
                    vectorLayer
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
            map.on('loadstart', function () {
                map.getTargetElement().classList.add('spinner');
            });
            map.on('loadend', function () {
                map.getTargetElement().classList.remove('spinner');
            });
            map.on('moveend', debounce(() => {
                map.getTargetElement().classList.add('spinner');
                const mapSize = map?.getSize();
                const extent = map?.getView().calculateExtent(mapSize);
                store.dispatch(loadPictureRequests({
                    minLat: extent[1],
                    minLng: extent[0],
                    maxLat: extent[3],
                    maxLng: extent[2],
                }));
              }, 500));
            return map;
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

    useEffect(() => {
        if (pictureRequestStatus === "complete") {
            const features = new GeoJSON().readFeatures(pictureRequestsState);
            const source = vectorLayer.getSource();
            if (source) {
                source.clear();
                source.addFeatures(features);
            }
            map?.getTargetElement().classList.remove('spinner');
        }
    }, [pictureRequestsState]);

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

    const searchHandler = async (e: any) => {
        setIsLoading(true);
        findAddress(query).then((results) => {
            const searchResults = Array.isArray(results) ? results : [];
            if (searchResults.length == 0) {
                setItems([{ display_name: "No results found" }]);
            } else {
                setItems(searchResults);
            }
            setIsLoading(false);
            setOpen(true);
        });
    }

    const centerMap = (position: { coords: { latitude: number, longitude: number } }) => {
        const mapSize = map?.getSize();
        if (mapSize) {
            map?.getView().centerOn([position.coords.longitude, position.coords.latitude], mapSize, [mapSize[0] / 2, mapSize[1] / 2]);
        }
    }

    return (
        <Card className="py-4 mb-auto h-full w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h2 className="text-2xl font-bold pb-1">Activity Near You</h2>
                <div className="flex-row items-center w-full flex">
                    <div className="w-1/8">
                        <Tooltip content="Click this icon to allow us to request access and show your device location on map">
                            <Link href="#" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                map?.getTargetElement().classList.add('spinner');
                                navigator.geolocation.getCurrentPosition((position) => {
                                    centerMap(position);
                                }, (error) => {
                                    console.error(error);
                                },
                                    {
                                        enableHighAccuracy: false,
                                        timeout: 2000,
                                        maximumAge: 0,
                                    });
                            }}>
                                <Image src="/assets/images/icons/location.svg" width={40} height={40} alt="Click to move map to current location" />
                            </Link>
                        </Tooltip>
                    </div>
                    <div className="w-5/6">
                        <Input
                            type="text"
                            placeholder="Enter a location"
                            labelPlacement="outside"
                            className="w-full px-5"
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                            id="search"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchHandler(e);
                                }
                            }}
                        />
                    </div>
                    <div className="w-1/8 content-end">
                        <Popover placement="bottom-end" isOpen={open}
                            shouldCloseOnBlur={true}
                            classNames={{
                                content: [
                                    "items-start",
                                    "flex"
                                ]
                            }}>
                            <PopoverTrigger>
                                <Button variant="flat" className="capitalize px-5" endContent={<SearchIcon />} isLoading={isLoading} onClick={searchHandler}>
                                    Search
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                {items.map((item) => (
                                    <Link href="#" onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!item.lon || !item.lat) {
                                            setOpen(false);
                                            return;
                                        }
                                        centerMap({ coords: { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) } });
                                        setItems([]);
                                        setOpen(false);
                                    }}><h2 className="w-full">{item.display_name}</h2></Link>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
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