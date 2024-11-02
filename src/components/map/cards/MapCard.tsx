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
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import DragPan from 'ol/interaction/DragPan';
import MapRequestPopup from "@component/modals/map/MapRequestPopup";
import GeolocationControl from "@component/map/widgets/GeolocationControl";
import { Control, defaults as defaultControls } from 'ol/control';
import RequestModeControl from "@component/map/widgets/RequestModeControl";
import LocationSearchControl from "@component/map/widgets/LocationSearchControl";

export default function MapCard({
    initialPosition,
    token,
    mapTarget
}: {
    initialPosition: { coords: { latitude: number, longitude: number } },
    token: string,
    mapTarget: string
}) {

    const store = useAppStore();
    const [mounted, setMounted] = React.useState(false);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);
    const [vectorLayer, setVectorLayer] = React.useState<VectorLayer>();
    const [overlay, setOverlay] = React.useState<Overlay>();
    const geojson = new GeoJSON();
    const pictureRequestBtn = "pictureRequestBtn" + mapTarget;
    const popupContainerId = "popup-container" + mapTarget;

    const mapClickHandler = (e: any, overlay: any, vectorLayer: any) => {
        if (document.getElementById(pictureRequestBtn)?.classList.contains("requestModeDisabled")) {
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
        for (var layerIndex in map?.getLayers().getArray()) {
            const index = Number(layerIndex);
            const layer = map?.getLayers().getArray()[index] as VectorLayer;
            if (layer.getSource() instanceof VectorSource) {
                if (layer.getSource()?.getFeatureById("request")) {
                    layer.getSource()?.getFeatureById("request").getGeometry().setCoordinates([0, 0]);
                    vectorLayer?.setVisible(false);
                    vectorLayer?.setVisible(true);
                }
            }
        }
    };

    const centerMap = (position: { coords: { latitude: number, longitude: number } }) => {
        const mapSize = map?.getSize();
        if (mapSize) {
            map?.getView().centerOn([position.coords.longitude, position.coords.latitude], mapSize, [mapSize[0] / 2, mapSize[1] / 2]);
        }
    };

    const pictureRequestMode = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        var rm = !document.getElementById(pictureRequestBtn)?.classList.toggle("requestModeDisabled");
        if (rm == undefined) {
            rm = false;
        }
        // change here if I want to let user drag map while request window open
        // might want this...
        map?.getOverlays().getArray()[0].setPosition(undefined);
        clearRequest();
        if (!rm) {
            map?.getInteractions().forEach(function (interaction: { setActive: (arg0: boolean) => void; }) {
                if (interaction instanceof DragPan) {
                    interaction.setActive(true);
                }
            });
        } else {
            map?.getInteractions().forEach(function (interaction: { setActive: (arg0: boolean) => void; }) {
                if (interaction instanceof DragPan) {
                    interaction.setActive(false);
                }
            });
        }
    };

    const map = useMemo(() => {
        if (mounted) {
            const container = document.getElementById(popupContainerId);
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
                target: mapTarget,
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
                controls: defaultControls().extend([
                    new GeolocationControl(centerMap),
                    new RequestModeControl(pictureRequestMode, token, pictureRequestBtn),
                    new LocationSearchControl(centerMap)
                ]),
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

    return (
        <div className="bg-white p-dynamic h-full w-full">
            <div id={mapTarget} className="h-full w-full"></div>
            <div id={popupContainerId}>
                <MapRequestPopup
                    closePopup={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.savedRequest) {
                            const mapSize = map?.getSize();
                            const extent = map?.getView().calculateExtent(mapSize);
                            if (extent) {
                                const bbox: BoundingBox = {
                                    min_latitude: extent[0],
                                    min_longitude: extent[1],
                                    max_latitude: extent[2],
                                    max_longitude: extent[3],
                                };
                                store.dispatch(loadPictureRequests(bbox, limitSelect, offsetSelect));
                            }
                        }
                        overlay?.setPosition(undefined);
                        clearRequest();
                    }}
                    vectorLayer={vectorLayer}
                    token={token}
                />
            </div>
        </div>
    )
}