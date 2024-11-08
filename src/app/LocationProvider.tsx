"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import AppOnloadTasks from "@hook/AppOnloadTasks";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { selectDeviceLocation } from "@lib/features/location/deviceLocationSlice";
import React from "react";
import { setMapLocation } from "@lib/features/location/mapLocationSlice";

interface Props {
    readonly headersList: any;
    readonly children: ReactNode;
}

export const LocationProvider = ({ children, headersList }: Props) => {

    const store = useAppStore();
    const location = useAppSelector(selectDeviceLocation);
    const [deviceLocation, setDeviceLocation] = React.useState(location);


    useEffect(() => {
        // perform app onload actions here
        AppOnloadTasks({ headersList, store }).executeOnloadTasks();
    }, []);

    useEffect(() => {
        if (deviceLocation.latitude == -1 && deviceLocation.longitude == -1) {
            if (location.latitude != -1 && location.longitude != -1) {
                setDeviceLocation(location);
                store.dispatch(setMapLocation(location));
            }
        }
    }, [location]);

    return <>{children}</>;
};