"use client";

export async function findAddress(query: string) {
    const controller = new AbortController();
    const { signal } = controller;

    let res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
        { signal },
    );

    if (!res.ok) {
        throw new Error("Network response was not ok");
    }

    let json = await res.json();

    return json;
};
