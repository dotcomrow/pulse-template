'use server';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { BoundingBox } from "@lib/features/map/mapSlice";

export default async function fetchPictureRequests(bbox: BoundingBox, limit: number, offset: number): Promise<any> {
    const env = getRequestContext().env as { GRAPHQL?: { fetch: (url: string, options: any) => Promise<any> } };
    try {
        const res = await env.GRAPHQL?.fetch("https://api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query {
                    fetchPictureRequestsByBoundingBox(bbox: {
                        min_latitude: ${bbox.min_latitude},
                        min_longitude: ${bbox.min_longitude},
                        max_latitude: ${bbox.max_latitude},
                        max_longitude: ${bbox.max_longitude}
                    },
                    limit: ${limit},
                    offset: ${offset}) {
                        request_id
                        account_id
                        capture_timestamp
                        direction
                        location
                        updated_at
                        bid_type
                        request_title
                        request_description
                        total
                    }
                }
            `,
            }),
        });
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
                    fetchPictureRequestsByBoundingBox(bbox: {
                        min_latitude: ${bbox.min_latitude},
                        min_longitude: ${bbox.min_longitude},
                        max_latitude: ${bbox.max_latitude},
                        max_longitude: ${bbox.max_longitude}
                    },
                    limit: ${limit},
                    offset: ${offset}) {
                        request_id
                        account_id
                        capture_timestamp
                        direction
                        location
                        updated_at
                        bid_type
                        request_title
                        request_description
                        total
                    }
                }
            `,
            }),
        });
        return res.json();
    }
}