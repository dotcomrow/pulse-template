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
import React, { ReactElement, Suspense, use, useEffect } from "react";
import { useGeographic } from "ol/proj.js";

export default function MapCard({ initialPosition }: { initialPosition: { coords: { latitude: number, longitude: number } } }) {

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

    const constructMap = async (pos: any) => {
        const map = new Map({
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
                zoom: 10,
                maxZoom: 14,
                minZoom: 8,
                center: [pos.coords.longitude, pos.coords.latitude],
                constrainResolution: true,
            }),
            // overlays: [
            //     new Overlay({
            //         element: buildPopup(),
            //         autoPan: true,
            //     }),
            // ],
        });
    };

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
        useGeographic();
        constructMap(initialPosition);
    }, []);

    const MapComponent = async ({ initialPosition }: { initialPosition: { coords: { latitude: number, longitude: number } } }) => {
        
        // useEffect(() => {
        //     useGeographic();

        //     navigator.geolocation.getCurrentPosition(
        //         (pos) => {
        //             var map = constructMap(pos);
        //         },
        //         (err) => {
        //             console.warn(`ERROR(${err.code}): ${err.message}`);
        //             var map = constructMap({
        //                 coords: {
        //                     latitude: 51.505,
        //                     longitude: -0.09,
        //                 },
        //             });
        //         },
        //         {
        //             enableHighAccuracy: false,
        //             timeout: 5000,
        //             maximumAge: 0,
        //         }
        //     );

        // }, []);

        return (
            <>
                <div id="map-container" className="h-full"></div>
                <div id="popup-container"></div>
            </>
        );
    };

    return (
        <Card className="py-4 mb-auto h-full w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Search Address</p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="bg-white p-dynamic h-full">
                    <MapComponent initialPosition={initialPosition} />
                </div>
            </CardBody>
        </Card>
    )
}