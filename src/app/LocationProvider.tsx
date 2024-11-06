"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import AppOnloadTasks from "@hook/AppOnloadTasks";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";

interface Props {
    readonly headersList: any;
    readonly children: ReactNode;
}

export const LocationProvider = ({ children, headersList }: Props) => {

    const store = useAppStore();
    
    useEffect(() => {
        // perform app onload actions here
        AppOnloadTasks({ headersList, store }).executeOnloadTasks();
    }, []);

    return <>{children}</>;
};