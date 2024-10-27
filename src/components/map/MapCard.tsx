"use client";

import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox } from "ol/loadingstrategy.js";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import { transformExtent, transform } from "ol/proj.js";
import OSM from "ol/source/OSM";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import React, { useEffect, useMemo, useCallback } from "react";
import { useGeographic, toLonLat } from "ol/proj.js";
import { Image } from "@nextui-org/image";
import { findAddress } from "./findAddress";
import { Input } from "@nextui-org/input";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import "@styles/map/spinner.css"
import { BoundingBox, loadPictureRequests } from "@lib/features/map/mapSlice";
import { selectPictureRequests, selectPictureRequestStatus } from "@lib/features/map/mapSlice";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { debounce, set } from 'lodash';
import { Fill, Stroke, Style } from 'ol/style';
import Checkmark from '@images/icons/check.svg';
import { Spinner } from "@nextui-org/spinner";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import DragPan from 'ol/interaction/DragPan';
import RequestSubmit from "./RequestSubmit";
import CloseCross from '@images/icons/close.svg';

export default function MapCard({ initialPosition }: { initialPosition: { coords: { latitude: number, longitude: number } } }) {

    const store = useAppStore();
    const [mounted, setMounted] = React.useState(false);
    const [items, setItems] = React.useState<any[]>([]);
    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const [searchDisabled, setSearchDisabled] = React.useState(true);
    const [requestMode, setRequestMode] = React.useState(false);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [vectorLayer, setVectorLayer] = React.useState<VectorLayer>();
    const [overlay, setOverlay] = React.useState<Overlay>();
    const [geomString, setGeomString] = React.useState("");
    const geojson = new GeoJSON();

    const mapClickHandler = (e: any, content: any, overlay: any, vectorLayer: any) => {
        if (document.getElementById("pictureRequestBtn")?.classList.contains("requestModeDisabled")) {
            return;
        }
        const coordinate = e.coordinate;
        e.preventDefault();
        e.stopPropagation();
        const source = vectorLayer.getSource();
        const features = geojson.readFeatures(pictureRequestsState);
        source.clear();

        var feat = new Feature(new Point(coordinate));
        feat.setStyle(new Style({
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.3)',
                    width: 1,
                }),
            })
        }));
        setGeomString(JSON.stringify(coordinate));
        features.push(feat);
        source.addFeatures(features);
        overlay.setPosition(coordinate);

        document.getElementById('popup-closer')?.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            overlay.setPosition(undefined);
            setGeomString("");
            source.clear();
            const features = geojson.readFeatures(pictureRequestsState);
            source.addFeatures(features);
        });
    };

    const map = useMemo(() => {
        if (mounted) {
            const container = document.getElementById('popup-container');
            const content = document.getElementById('popup-content');
            const overlay = container ? new Overlay({
                element: container,
                autoPan: {
                    animation: {
                        duration: 250,
                    },
                },
            }) : new Overlay({});
            setOverlay(overlay);
            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: geojson.readFeatures({
                        type: "FeatureCollection",
                        features: []
                    }),
                    strategy: bbox,
                    overlaps: false,
                    wrapX: false,
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
            setVectorLayer(vectorLayer);
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
                overlays: [
                    overlay
                ],
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
                const extent = transformExtent(map?.getView().calculateExtent(mapSize), 'EPSG:3857', 'EPSG:4326');
                const bbox: BoundingBox = {
                    min_latitude: extent[1],
                    min_longitude: extent[0],
                    max_latitude: extent[3],
                    max_longitude: extent[2],
                };
                store.dispatch(loadPictureRequests(bbox));
            }, 500));
            map.on('click', (e) => {
                mapClickHandler(e, content, overlay, vectorLayer);
            });
            return map;
        }
    }, [mounted]);

    const searchHandler = (e: any) => {
        if (searchDisabled) {
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
            setSearchDisabled(true);
            setOpen(true);
            setSearchLoading(false);
        });
    }

    const SearchIcon = ({
        size = 24,
        isDisabled = { searchDisabled },
        ...props
    }) => (
        <Link href="#" style={{ cursor: isDisabled.searchDisabled ? "default" : "pointer" }}>
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
                    stroke={isDisabled.searchDisabled ? "grey" : "blue"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isDisabled.searchDisabled ? 1.5 : 2.5}
                />
                <path
                    d="M22 22L20 20"
                    stroke={isDisabled.searchDisabled ? "grey" : "blue"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isDisabled.searchDisabled ? 1.5 : 2.5}
                />
            </svg>
        </Link>
    );

    useEffect(() => {
        if (pictureRequestStatus === "complete") {
            const features = geojson.readFeatures(pictureRequestsState);
            const source = vectorLayer?.getSource();
            if (source) {
                source.clear();
                if (geomString.length > 0) {
                    var feat = new Feature(new Point(JSON.parse(geomString)));
                    feat.setStyle(new Style({
                        image: new CircleStyle({
                            radius: 10,
                            fill: new Fill({
                                color: 'rgba(0, 0, 255, 0.1)',
                            }),
                            stroke: new Stroke({
                                color: 'rgba(0, 0, 255, 0.3)',
                                width: 1,
                            }),
                        })
                    }));
                    features.push(feat);
                }
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

    const centerMap = (position: { coords: { latitude: number, longitude: number } }) => {
        const mapSize = map?.getSize();
        if (mapSize) {
            map?.getView().centerOn([position.coords.longitude, position.coords.latitude], mapSize, [mapSize[0] / 2, mapSize[1] / 2]);
        }
    }

    const pictureRequestMode = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setRequestMode(!requestMode);
        vectorLayer?.getSource()?.clear();
        overlay?.setPosition(undefined);
        setGeomString("");
        const features = geojson.readFeatures(pictureRequestsState);
        vectorLayer?.getSource()?.addFeatures(features);

        if (requestMode) {
            map?.getInteractions().forEach(function (interaction) {
                if (interaction instanceof DragPan) {
                    interaction.setActive(true);
                }
            });
        } else {
            map?.getInteractions().forEach(function (interaction) {
                if (interaction instanceof DragPan) {
                    interaction.setActive(false);
                }
            });
        }
    };

    return (
        <Card className="py-4 mb-auto h-full w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col">
                <div className="flex-row w-full flex justify-start">
                    <h2 className="text-2xl font-bold pb-3">Activity Near You</h2>
                </div>
                <div className="flex-row w-full flex">
                    <div className="w-1/8 justify-start flex">
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
                    <div className="md:w-5/6 sm:w-2/3 flex">
                        <Input
                            isClearable
                            value={query}
                            type="text"
                            placeholder="Enter a location"
                            labelPlacement="outside"
                            className="w-full px-2 z-20"
                            onClear={() => {
                                setQuery("")
                                setSearchDisabled(true);
                            }}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                if (query.length > 0) {
                                    setSearchDisabled(false);
                                } else {
                                    setSearchDisabled(true);
                                }
                            }}
                            id="search"
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
                                        <SearchIcon onClick={searchHandler} />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        {items.map((item) => (
                                            <Link
                                                href="#"
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#0008ff'
                                                    e.currentTarget.style.color = '#FFFFFF'
                                                }}
                                                onMouseOut={(e) => {
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
                                                    centerMap({ coords: { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) } });
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
                    </div>
                    <div className="md:w-1/6 sm:1/3 justify-end flex">
                        <Button id="pictureRequestBtn"
                            startContent={requestMode ? Checkmark() : <></>}
                            onClick={pictureRequestMode}
                            className={requestMode ? "requestModeEnabled" : "requestModeDisabled"}>
                            Request Mode
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="bg-white p-dynamic h-full">
                    <div id="map-container" className="h-full"></div>
                    <div id="popup-container">
                        <Card>
                            <CardHeader className="flex-row items-center w-full flex">
                                <div className="w-1/2 justify-start flex">
                                    <h2 className="font-bold">Request Picture</h2>
                                </div>
                                <div className="w-1/2 justify-end flex">
                                    <Tooltip content="Click this icon to close the request picture popup">
                                        <Link href="#" id="popup-closer"><CloseCross /></Link>
                                    </Tooltip>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div id="popup-content">
                                    <RequestSubmit geomString={geomString} />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}