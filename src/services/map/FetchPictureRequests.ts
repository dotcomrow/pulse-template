'use server';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { BoundingBox } from "@lib/features/map/mapSlice";
import LoggingUtility from "@utils/LoggingUtility";

export default async function fetchPictureRequests(bbox: BoundingBox): Promise<any> {
    const env = getRequestContext().env as { GRAPHQL?: { fetch: (url: string, options: any) => Promise<any> } };
    try {
        // using service binding when deployed
        const res = await env.GRAPHQL?.fetch("https://api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query {
                    fetchPictureRequestsByBoundingBox(
                        min_latitude: ${bbox.minLat},
                        min_longitude: ${bbox.minLng},
                        max_latitude: ${bbox.maxLat},
                        max_longitude: ${bbox.maxLng}
                    ) {
                        request_id
                    }
                }
            `,
            }),
        })
        // await LoggingUtility.logEntry(await LoggingUtility.buildLogContext(),
        //     {
        //         severity: "ERROR",
        //         jsonPayload: {
        //             message: "Failed to fetch picture requests using service binding, calling direct",
        //         },
        //     },
        // );
        if (res.status !== 200) {
            throw new Error("Failed to fetch picture requests using service binding, calling direct");
        }
        return res.json();
    } catch (error) {
        // calling remote when running locally
        const res = await fetch("https://pulse-graphql.dev.suncoast.systems/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query {
                    fetchPictureRequestsByBoundingBox(
                        min_latitude: ${bbox.minLat},
                        min_longitude: ${bbox.minLng},
                        max_latitude: ${bbox.maxLat},
                        max_longitude: ${bbox.maxLng}
                    ) {
                        request_id
                    }
                }
            `,
            }),
        });
        return res.json();
    }
}