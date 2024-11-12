import React from "react";
import { clearNotification, setNotification } from "@lib/features/notification/notificationSlice";
import { LocationDTO, setDeviceLocation } from "@lib/features/location/deviceLocationSlice";

export default function LocationOnLoad({ headersList, store }: { headersList: any, store: any }) {
    var initialLocation: LocationDTO = {
        latitude: -1,
        longitude: -1,
        deviceLocation: false,
    };
    if ("geolocation" in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((e) => {
            if (e.state === 'granted') {
                // we are allowed to get device location
                navigator.geolocation.watchPosition((position) => {
                    initialLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        deviceLocation: true,
                    };
                    store.dispatch(setDeviceLocation(initialLocation));
                }, (error) => {
                    initialLocation = {
                        latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                        longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                        deviceLocation: false,
                    };
                    store.dispatch(setDeviceLocation(initialLocation))
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                });
            } else if (e.state === 'prompt') {
                // We can tell the user what cloudflare detected but we can ask to use device location
                const detectedLocation =
                    React.createElement('div', null,
                        React.createElement('p', null, "SnapSpot would like to use your device location to provide a better experience."),
                        React.createElement('br', null),
                        React.createElement(
                            'p',
                            null,
                            'Detected location:'
                            ,
                            React.createElement(
                                'p',
                                null,
                                decodeURI(headersList.filter((item: { name: string; }) => item.name === 'x-vercel-ip-city')[0].value),
                                ', ',
                                decodeURI(headersList.filter((item: { name: string; }) => item.name === 'x-vercel-ip-country-region')[0].value),
                                ', ',
                                decodeURI(headersList.filter((item: { name: string; }) => item.name === 'x-vercel-ip-country')[0].value)
                            )),
                        React.createElement('br', null),
                        React.createElement('p', null, 'Would you like to allow SnapSpot to use your device location?'));

                store.dispatch(setNotification(
                    {
                        title: "Location Permissions",
                        message: detectedLocation,
                        severity: "info",
                        icon: "info",
                        show: true,
                        dissmissable: false,
                        denyAction: {
                            label: "Deny",
                            onClick: () => {
                                initialLocation = {
                                    latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                                    longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                                    deviceLocation: false,
                                };
                                store.dispatch(setDeviceLocation(initialLocation));
                                store.dispatch(clearNotification());
                            }
                        },
                        confirmAction: {
                            label: "Allow",
                            onClick: () => {
                                navigator.geolocation.watchPosition((position) => {
                                    initialLocation = {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        deviceLocation: true,
                                    };
                                    store.dispatch(setDeviceLocation(initialLocation));
                                }, (error) => {
                                    initialLocation = {
                                        latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                                        longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                                        deviceLocation: false,
                                    };
                                    store.dispatch(setDeviceLocation(initialLocation));
                                }, {
                                    enableHighAccuracy: true,
                                    timeout: 5000,
                                });
                                store.dispatch(clearNotification());
                            }
                        }
                    }
                ));
            } else if (e.state === 'denied') {
                // user said no so we can ONLY use what cloudflare detects
                initialLocation = {
                    latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                    longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                    deviceLocation: false,
                };
                store.dispatch(setDeviceLocation(initialLocation));
            }
        });
    } else {
        initialLocation = {
            latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
            longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
            deviceLocation: false,
        };
        store.dispatch(setDeviceLocation(initialLocation));
    }
}