'use server';

import { getRequestContext } from "@cloudflare/next-on-pages";
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import GeoJSON from "ol/format/GeoJSON";


export default async function savePictureRequests(
    request: {
        title: string;
        description: string;
        date: number;
        bidType: string;
        geom: string;
        direction: number;
    },
    token: string
): Promise<any> {
    const geojson = new GeoJSON();
    var feat = new Feature(new Point(JSON.parse(request.geom)));
    const featureObj = JSON.parse(geojson.writeFeature(feat));
    const geometry = featureObj.geometry;
    const env = getRequestContext().env as { GRAPHQL?: { fetch: (url: string, options: any) => Promise<any> } };
    try {
        // using service binding when deployed
        const res = await env.GRAPHQL?.fetch("https://api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                query:`
                    mutation savePictureRequest($request: SavePictureRequests!) 
                        {
                            savePictureRequest(request: $request) {
                                request_id
                            }
                        }`,
                variables:{
                    request:{
                        location: JSON.stringify(geometry).replace(/"/g, "'"),
                        direction: request.direction,
                        capture_timestamp: request.date,
                        request_title: request.title,
                        request_description: request.description,
                        bid_type: request.bidType
                    }
                }
            }),
        });
        if (res.status !== 200) {
            throw new Error("Failed to save picture requests using service binding, calling direct");
        }
        return res.json();
    } catch (error) {
        // calling remote when running locally
        const res = await fetch("https://pulse-graphql.dev.suncoast.systems/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                query:`
                    mutation savePictureRequest($request: SavePictureRequests!) 
                        {
                            savePictureRequest(request: $request) {
                                request_id
                            }
                        }`,
                variables:{
                    request:{
                        location: JSON.stringify(geometry).replace(/"/g, "'"),
                        direction: request.direction,
                        capture_timestamp: request.date,
                        request_title: request.title,
                        request_description: request.description,
                        bid_type: request.bidType
                    }
                }
            }),
        });
        return res.json();
    }
}