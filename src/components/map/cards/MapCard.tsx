"use client";

import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import React, { useEffect, useMemo } from "react";
import { useGeographic } from "ol/proj.js";
import { Image } from "@nextui-org/image";
import { findAddress } from "@services/map/findAddress";
import { Input } from "@nextui-org/input";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import "@styles/map/spinner.css"
import { BoundingBox, loadPictureRequests } from "@lib/features/map/mapSlice";
import { 
    selectPictureRequests, 
    selectPictureRequestStatus,
    selectLimit,
    selectOffset
} from "@lib/features/map/mapSlice";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { debounce } from 'lodash';
import { Fill, Stroke, Style } from 'ol/style';
import { Spinner } from "@nextui-org/spinner";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import DragPan from 'ol/interaction/DragPan';
import MapRequestPopup from "@component/modals/map/MapRequestPopup";
import { setError } from "@lib/features/error/errorSlice";

export default function MapCard({
    initialPosition,
    token
}: {
    initialPosition: { coords: { latitude: number, longitude: number } },
    token: string
}) {

    const store = useAppStore();
    const [mounted, setMounted] = React.useState(false);
    const [items, setItems] = React.useState<any[]>([]);
    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);
    const [searchDisabled, setSearchDisabled] = React.useState(true);
    const [requestMode, setRequestMode] = React.useState(false);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [vectorLayer, setVectorLayer] = React.useState<VectorLayer>();
    const [overlay, setOverlay] = React.useState<Overlay>();
    const geojson = new GeoJSON();

    const mapClickHandler = (e: any, overlay: any, vectorLayer: any) => {
        if (document.getElementById("pictureRequestBtn")?.classList.contains("requestModeDisabled")) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const coordinate = e.coordinate;
        const source = vectorLayer.getSource();
        const features = pictureRequestsState;

        const requestFeature = vectorLayer?.getSource()?.getFeatureById("request");
        if (!requestFeature) {
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
            feat.setId("request");
            vectorLayer?.getSource()?.addFeature(feat);

        } else {
            vectorLayer?.getSource()?.getFeatureById("request").getGeometry().setCoordinates(coordinate);
        }
        vectorLayer?.setVisible(false);
        vectorLayer?.setVisible(true);
        source.addFeatures(features);
        overlay.setPosition(coordinate);
    };

    const clearRequest = () => {
        if (vectorLayer?.getSource()?.getFeatureById("request")) {
            vectorLayer?.getSource()?.getFeatureById("request").getGeometry().setCoordinates([0, 0]);
            vectorLayer?.setVisible(false);
            vectorLayer?.setVisible(true);
        }
    };

    const map = useMemo(() => {
        if (mounted) {
            const container = document.getElementById('popup-container');
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
                        source: new OSM({
                            wrapX: false
                        }),
                        visible: true
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
                const extent = map?.getView().calculateExtent(mapSize);
                const bbox: BoundingBox = {
                    min_latitude: extent[0],
                    min_longitude: extent[1],
                    max_latitude: extent[2],
                    max_longitude: extent[3],
                };
                store.dispatch(loadPictureRequests(bbox, limitSelect, offsetSelect));
            }, 500));
            map.on('click', (e) => {
                mapClickHandler(e, overlay, vectorLayer);
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
            setOpen(true);
            setSearchDisabled(true);
            setSearchLoading(false);
        });
    }

    useEffect(() => {
        if (pictureRequestStatus === "complete") {
            const features = pictureRequestsState;
            vectorLayer?.getSource()?.addFeatures(features);
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

        var rm = !document.getElementById("pictureRequestBtn")?.classList.toggle("requestModeDisabled");
        if (rm == undefined) {
            rm = false;
        }
        setRequestMode(rm);
        overlay?.setPosition(undefined);
        clearRequest();
        if (!rm) {
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
                    <div className="w-1/8 shrink-0 justify-start flex">
                        <Tooltip content="Click this icon to allow us to request access and show your device location on map">
                            <Link href="#" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                map?.getTargetElement().classList.add('spinner');
                                navigator.geolocation.getCurrentPosition((position) => {
                                    centerMap(position);
                                }, (error) => {
                                    const errorMsg = "An error occured while trying to get your location. Please ensure you have location services enabled on your device and allow this site permission to read device location.  Error message: " + error.message;
                                    store.dispatch(setError({ error: "Geolocation error", details: errorMsg, exception: error }));
                                },
                                    {
                                        enableHighAccuracy: false,
                                        timeout: 3000,
                                        maximumAge: 0,
                                    });
                            }}>
                                <Image
                                    src="/assets/images/icons/location.svg"
                                    width={40}
                                    height={40}
                                    shadow="sm"
                                    radius="sm"
                                    className="p-1"
                                    alt="Click to move map to current location"
                                />
                            </Link>
                        </Tooltip>
                    </div>
                    <div className="lg:w-5/6 sm:w-2/3 flex">
                        <Input
                            isClearable
                            value={query}
                            type="text"
                            placeholder="Enter a location"
                            labelPlacement="outside"
                            className="w-full px-2 z-20"
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
                    <div className="lg:w-1/6 sm:w-1/3 justify-end flex">
                        <Tooltip content={token.length == 0 ? "Please login to submit a request" : "Select a location on the map and complete the request submit dialog form"}>
                            <div className="w-full justify-end flex">
                                <Button id="pictureRequestBtn"
                                    startContent={requestMode ? <div className="shrink-0">
                                        <Image
                                            src="/assets/images/icons/check.svg"
                                            width={40}
                                            height={40}
                                            style={{
                                                padding: "0.5rem",
                                            }}
                                        />
                                    </div> : <></>}
                                    onClick={pictureRequestMode}
                                    isDisabled={token.length == 0}
                                    className="requestModeDisabled"
                                >
                                    Request Mode
                                </Button>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="bg-white p-dynamic h-full">
                    <div id="map-container" className="h-full"></div>
                    <div id="popup-container">
                        <MapRequestPopup 
                            closePopup={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                overlay?.setPosition(undefined);
                                clearRequest();
                            }}
                            vectorLayer={vectorLayer}
                            token={token} 
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}