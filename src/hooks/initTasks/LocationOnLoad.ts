import React from "react";
import { setInitialLocation } from "@lib/features/location/locationSlice";
import { clearNotification, setNotification } from "@lib/features/notification/notificationSlice";

export default function LocationOnLoad({ headersList, store }: { headersList: any, store: any }) {
    if ("geolocation" in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((e) => {
            if (e.state === 'granted') {
                localStorage.setItem('locationPermissionGranted', 'true');
                // we are allowed to get device location
                navigator.geolocation.getCurrentPosition((position) => {
                    store.dispatch(setInitialLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        deviceLocation: true,
                        locationPermissionsAllowed: true,
                        locationLoaded: true
                    }));
                }, (error) => {
                    store.dispatch(setInitialLocation({
                        latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                        longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                        deviceLocation: false,
                        locationPermissionsAllowed: false,
                        locationLoaded: true
                    }));
                },
                    {
                        enableHighAccuracy: false,
                        timeout: 3000,
                        maximumAge: 0,
                    });
            } else if (e.state === 'prompt') {
                // We can tell the user what cloudflare detected but we can ask to use device location
                const detectedLocation =

                    React.createElement('div',
                        React.createElement('p', null, "SnapSpot would like to use your device location to provide a better experience."),


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
                        denyAction: {
                            label: "Deny",
                            onClick: () => {
                                store.dispatch(setInitialLocation({
                                    latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                                    longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                                    deviceLocation: false,
                                    locationPermissionsAllowed: false,
                                    locationLoaded: true
                                }));
                                store.dispatch(clearNotification());
                            }
                        },
                        confirmAction: {
                            label: "Allow",
                            onClick: () => {
                                navigator.geolocation.getCurrentPosition((position) => {
                                    store.dispatch(setInitialLocation({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        deviceLocation: true,
                                        locationPermissionsAllowed: true,
                                        locationLoaded: true
                                    }));
                                    store.dispatch(clearNotification());
                                }, (error) => {
                                    store.dispatch(setNotification({
                                        title: "Geolocation error",
                                        message: React.createElement("p", "An error occurred while trying to get your location. Please ensure you have location services enabled on your device and allow this site permission to read device location.  Error message: " + error.message),
                                        severity: "error",
                                        icon: "error",
                                        show: true,
                                        denyAction: {
                                            label: "Dismiss",
                                            onClick: () => {
                                                store.dispatch(clearNotification());
                                            }
                                        },
                                        confirmAction: {
                                            label: "Dismiss",
                                            onClick: () => {
                                                store.dispatch(clearNotification());
                                            }
                                        }
                                    }));
                                    store.dispatch(setInitialLocation({
                                        latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                                        longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                                        deviceLocation: false,
                                        locationPermissionsAllowed: false,
                                        locationLoaded: true
                                    }));
                                    store.dispatch(clearNotification());
                                },
                                    {
                                        enableHighAccuracy: false,
                                        timeout: 3000,
                                        maximumAge: 0,
                                    });
                            }
                        }
                    }
                ));
            } else if (e.state === 'denied') {
                // user said no so we can ONLY use what cloudflare detects
                store.dispatch(setInitialLocation({
                    latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                    longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                    deviceLocation: false,
                    locationPermissionsAllowed: false,
                    locationLoaded: true
                }));
            }
        });
    } else {
        store.dispatch(setInitialLocation({
            latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
            longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
            deviceLocation: false,
            locationPermissionsAllowed: false,
            locationLoaded: true
        }));
    }
}