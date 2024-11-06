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
import React, { createElement, useEffect, useMemo } from "react";
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
import { add, debounce, set } from 'lodash';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import Feature, { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import DragPan from 'ol/interaction/DragPan';
import MapRequestPopup from "@component/modals/map/MapRequestPopup";
import GeolocationControl from "@component/map/widgets/GeolocationControl";
import { Control, defaults as defaultControls } from 'ol/control';
import RequestModeControl from "@component/map/widgets/RequestModeControl";
import LocationSearchControl from "@component/map/widgets/LocationSearchControl";
import { selectLocation, updateLocation } from "@lib/features/location/locationSlice";
import { Popover, PopoverContent, Spinner } from "@nextui-org/react";
import { createRoot } from "react-dom/client";
import { getClosestAddress } from "@services/map/getClosestAddress";
import { selectDeviceLocation } from "@lib/features/location/deviceLocationSlice";

export default function MapCard({
    token,
    mapTarget
}: {
    token: string,
    mapTarget: string
}) {

    const store = useAppStore();
    const [mounted, setMounted] = React.useState(false);
    const pictureRequestsState: any = useAppSelector(selectPictureRequests);
    const pictureRequestStatus: any = useAppSelector(selectPictureRequestStatus);
    const initialLocationState: any = useAppSelector(selectLocation);
    const deviceLocationState: any = useAppSelector(selectDeviceLocation);
    const limitSelect: number = useAppSelector(selectLimit);
    const offsetSelect: number = useAppSelector(selectOffset);

    const pictureRequestBtn = "pictureRequestBtn" + mapTarget;
    const popupContainerId = "popup-container" + mapTarget;
    const featureInfoPopupId = "featureInfoPopup" + mapTarget;
    const displayLocation = "displayLocation" + mapTarget;

    const mapClickHandler = (e: any) => {
        if (document.getElementById(pictureRequestBtn)?.classList.contains("requestModeDisabled")) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const coordinate = e.coordinate;
        const vectorLayer = map?.getLayers().getArray()[1] as VectorLayer;
        const source = vectorLayer.getSource();
        const features = pictureRequestsState;
        const requestFeature = vectorLayer?.getSource()?.getFeatureById("request");
        if (!requestFeature) {
            var feat = new Feature(new Point(coordinate));
            feat.setStyle(new Style({
                image: new Icon({
                    opacity: 1,
                    src: "/assets/images/icons/camera.svg",
                    scale: 1.3
                }),
            }));
            feat.setId("request");
            vectorLayer?.getSource()?.addFeature(feat);
        } else {
            vectorLayer?.getSource()?.getFeatureById("request").getGeometry().setCoordinates(coordinate);
        }
        vectorLayer?.setVisible(false);
        vectorLayer?.setVisible(true);
        source?.addFeatures(features);
        const overlay = map?.getOverlayById("requestSubmit");
        overlay?.setPosition(coordinate);
    };

    const clearRequest = () => {
        for (var layerIndex in map?.getLayers().getArray()) {
            const index = Number(layerIndex);
            const layer = map?.getLayers().getArray()[index] as VectorLayer;
            if (layer.getSource() instanceof VectorSource) {
                if (layer.getSource()?.getFeatureById("request")) {
                    layer.getSource()?.getFeatureById("request").getGeometry().setCoordinates([0, 0]);
                    layer?.setVisible(false);
                    layer?.setVisible(true);
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
        // map?.getOverlays().getArray()[0].setPosition(undefined);
        // clearRequest();
        // The 2 lines above will clear selection and close the request window.
        // uncomment to clear request if user toggles out of request mode
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

    const featurePopover = async (feature: FeatureLike) => {
        document.getElementById(featureInfoPopupId)?.classList.remove('hidden');
        getClosestAddress({
            lat: (feature.getGeometry() as Point)?.getCoordinates()[1],
            lon: (feature.getGeometry() as Point)?.getCoordinates()[0]
        }).then((address: any) => {
            const addressContent =
                <>
                    <h2>Request Title: {feature.get('request_title')}</h2>
                    {feature.get('request_description') ?
                        <>
                            <h2>Request Description:</h2>
                            <p>{feature.get('request_description')}</p>
                        </> : <></>}
                    <h2>Request Date/Time: {new Date(feature.get('capture_timestamp')).toLocaleDateString(navigator.language) + " " + new Date(feature.get('capture_timestamp')).toLocaleTimeString(navigator.language)}</h2>
                    <h2>Location:</h2><br />
                    <p>{address.display_name}</p>
                </>;
            const displayLocationElement = document.getElementById(displayLocation);
            if (displayLocationElement) {
                const root = createRoot(displayLocationElement);
                root.render(addressContent);
            }
            setTimeout(() => {
                map?.getTargetElement().classList.add('fetchRequests');
            }, 1000);
        }).catch((error) => {
            const displayLocationElement = document.getElementById(displayLocation);
            if (displayLocationElement) {
                const root = createRoot(displayLocationElement);
                root.render(JSON.stringify(error));
            }
            setTimeout(() => {
                map?.getTargetElement().classList.add('fetchRequests');
            }, 1000);
        });

        const popoverContent = <>
            <div id={displayLocation}>
                <Spinner size="md" />
            </div>
        </>

        return React.createElement(
            'div',
            { style: { padding: '.5em' } },
            createElement(
                Popover,
                {
                    onBlur: () => {
                        document.getElementById(featureInfoPopupId)?.classList.add('hidden');
                    },
                    placement: 'left',
                    children: [
                        // createElement(Popover.Trigger, null, createElement(Button, { auto: true, onClick: togglePopover }, 'Open Popover')),
                        createElement(PopoverContent, null, createElement('p', {
                            style: {
                                padding: ".5em",
                            },
                            className: "lg:w-96 max-lg:w-52",
                        }, popoverContent))
                    ]
                }
            )
        );
    }

    const openFeaturePopover = (e: any, featureOverlay: any, feature: FeatureLike) => {
        e.preventDefault();
        e.stopPropagation();
        map?.getTargetElement().classList.remove('fetchRequests');
        featureOverlay?.setPosition(e.coordinate);
        centerMap({ coords: { latitude: (feature.getGeometry() as Point)?.getCoordinates()[1], longitude: (feature.getGeometry() as Point)?.getCoordinates()[0] } });
        const featurePopup = document.getElementById(featureInfoPopupId);

        if (featurePopup) {
            const root = createRoot(featurePopup);
            root.render(featurePopover(feature));
        }
    };

    const map = useMemo(() => {
        if (mounted) {
            const container = document.getElementById(popupContainerId);
            const featurePopup = document.getElementById(featureInfoPopupId);

            const overlay = container ? new Overlay({
                id: "requestSubmit",
                element: container,
                autoPan: {
                    animation: {
                        duration: 250,
                    },
                },
            }) : new Overlay({});

            const popup = featurePopup ? new Overlay({
                id: "featureInfo",
                element: featurePopup,
                autoPan: {
                    animation: {
                        duration: 250,
                    },
                },
            }) : new Overlay({});

            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    loader: function (extent, resolution, projection) {
                        if (map) {
                            if (map.getTargetElement().classList.contains('firstLoad')) {
                                map.getTargetElement().classList.remove('firstLoad');
                                return;
                            }
                            map.getTargetElement().classList.add('spinner');
                            // bbox coordinates are reversed here because google maps uses lat, lon and openlayers uses lon, lat
                            const bbox: BoundingBox = {
                                min_latitude: extent[0],
                                min_longitude: extent[1],
                                max_latitude: extent[2],
                                max_longitude: extent[3],
                            };
                            // do not reference this anywhere related to openlayers, this is for google bigquery
                            store.dispatch(loadPictureRequests(bbox, limitSelect, offsetSelect));
                        }
                    },
                    strategy: bbox,
                    overlaps: false,
                    wrapX: false,
                }),
                maxZoom: 18,
                minZoom: 16,
            });

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
                    overlay,
                    popup
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
            map.on('pointermove', function (e) {
                const pixel = map.getEventPixel(e.originalEvent);
                const hit = map.hasFeatureAtPixel(pixel);
                map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            });
            map.on('moveend', function () {
                const mapSize = map?.getSize();
                const extent = map?.getView().calculateExtent(mapSize);
                var centerLat = (extent[1] + extent[3]) / 2;
                var centerLon = (extent[0] + extent[2]) / 2;
                store.dispatch(updateLocation({
                    latitude: centerLat,
                    longitude: centerLon,
                    deviceLocation: initialLocationState.deviceLocation,
                    locationPermissionsAllowed: initialLocationState.locationPermissionsAllowed,
                    locationLoaded: true
                }));
            });
            map.on('click', (e) => {
                const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
                    return feature;
                });
                if (!feature) {
                    mapClickHandler(e);
                } else {
                    if (feature.getId() != "device-location") {
                        openFeaturePopover(e, popup, feature);
                    }
                }
            });
            var feat = new Feature(new Point([deviceLocationState.longitude, deviceLocationState.latitude]));
            feat.setStyle(new Style({
                image: new Icon({
                    opacity: 1,
                    src: "/assets/images/icons/map-pin_filled.svg",
                    scale: 1.3
                }),
            }));
            feat.setId("device-location");
            vectorLayer?.getSource()?.addFeature(feat);
            return map;
        }
    }, [mounted]);

    useEffect(() => {
        if (pictureRequestStatus === "complete") {
            const vectorLayer = map?.getLayers().getArray()[1] as VectorLayer;
            if (vectorLayer) {
                vectorLayer.getSource()?.addFeatures(pictureRequestsState);
                map?.getTargetElement().classList.remove('spinner');
            }
        }
    }, [pictureRequestsState]);

    useEffect(() => {
        if (map && initialLocationState.locationLoaded) {
            const mapSize = map?.getSize();
            if (mapSize) {
                centerMap({ coords: { latitude: initialLocationState.latitude, longitude: initialLocationState.longitude } });
                if (pictureRequestStatus === "complete") {
                    const vectorLayer = map?.getLayers().getArray()[1] as VectorLayer;
                    if (vectorLayer) {
                        vectorLayer.getSource()?.addFeatures(pictureRequestsState);
                        map?.getTargetElement().classList.remove('spinner');
                    }
                }
            }
        }
    }, [mounted]);

    useEffect(() => {
        useGeographic();
        if (initialLocationState.locationLoaded && !mounted) {
            setMounted(true);
        }
    }, [initialLocationState]);

    return (
        <div className="bg-white p-dynamic w-full h-full">
            <div id={mapTarget} className="h-full w-full spinner firstLoad">
                <div id={featureInfoPopupId}></div>
            </div>
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
                        map?.getOverlayById("requestSubmit")?.setPosition(undefined);
                        clearRequest();
                    }}
                    map={map}
                    token={token}
                    mapTarget={mapTarget}
                />
            </div>
        </div>
    )
}