"use client";

export async function getClosestAddress({lat, lon}: {lat: number, lon: number}) {
    const controller = new AbortController();
    const { signal } = controller;

    let res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { signal },
    );

    if (!res.ok) {
        throw new Error("Network response was not ok");
    }

    let json = await res.json();

    return json;
};
