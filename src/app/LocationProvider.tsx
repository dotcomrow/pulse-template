"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, createContext, useReducer, useContext } from "react";
import AppOnloadTasks from "@hook/AppOnloadTasks";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { selectDeviceLocation } from "@lib/features/location/deviceLocationSlice";
import React from "react";
import { LocationDTO, setMapLocation } from "@lib/features/location/mapLocationSlice";

interface Props {
    readonly headersList: any;
    readonly children: ReactNode;
}

interface LocationLoadedContextType {
    locationLoaded: boolean;
}

const locationLoadedContext = createContext<LocationLoadedContextType | null>(null);

export function useLocationLoaded() {
    return useContext(locationLoadedContext);
}

export const LocationProvider = ({ children, headersList }: Props) => {

    const store = useAppStore();
    const location = useAppSelector(selectDeviceLocation);
    const [deviceLocation, setDeviceLocation] = React.useState(location);

    const [locationLoaded, setLocationLoaded] = useReducer(
        (state: any, action: any) => {
            switch (action.type) {
                case 'setLoaded':
                    return { ...state, locationLoaded: true };
                default:
                    return state;
            }
        },
        { locationLoaded: false }
    );

    useEffect(() => {
        // perform app onload actions here
        AppOnloadTasks({ headersList, store }).executeOnloadTasks();
    }, []);

    useEffect(() => {
        if (deviceLocation.latitude == -1 && deviceLocation.longitude == -1) {
            if (location.latitude != -1 && location.longitude != -1) {
                setDeviceLocation(location);
                var loc: LocationDTO = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    zoom: 17
                };
                if (locationLoaded.locationLoaded == false) {
                    store.dispatch(setMapLocation(loc));
                    setLocationLoaded({ type: 'setLoaded' });
                }
            }
        }
    }, [location]);

    return (
        <locationLoadedContext.Provider value={{ locationLoaded }}>
            {children}
        </locationLoadedContext.Provider>
    );
};