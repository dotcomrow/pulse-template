import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset } from "@lib/features/map/mapSlice";
import { useAppSelector, useAppStore } from "@hook/redux";

const latitudeInitialWidth = 0.0064373;
const longitudeInitialWidth = 0.00786198;

export interface LocationDTO {
    latitude: number;
    longitude: number;
    deviceLocation: boolean;
    locationPermissionsAllowed: boolean;
    locationLoaded: boolean;
}

const initialState: LocationDTO = {
    latitude: -1,
    longitude: -1,
    deviceLocation: false,
    locationPermissionsAllowed: false,
    locationLoaded: false
};

export const locationSlice = createAppSlice({
    name: "initialLocation",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setInitialLocation: create.reducer((state, action: PayloadAction<LocationDTO>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.deviceLocation = action.payload.deviceLocation;
            state.locationPermissionsAllowed = action.payload.locationPermissionsAllowed;
            state.locationLoaded = action.payload.locationLoaded;
        }),
        updateLocation: create.reducer((state, action: PayloadAction<LocationDTO>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.deviceLocation = action.payload.deviceLocation;
            state.locationPermissionsAllowed = action.payload.locationPermissionsAllowed;
            state.locationLoaded = action.payload.locationLoaded;
        }),
    }),
    selectors: {
        selectInitialLocation: (state) => state
    },
});

export const {
    selectInitialLocation
} = locationSlice.selectors;

export const setInitialLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    dispatch(locationSlice.actions.setInitialLocation(location));
    const bbox: BoundingBox = {
        min_latitude: location.latitude - (latitudeInitialWidth / 2),
        min_longitude: location.longitude - (longitudeInitialWidth / 2),
        max_latitude: location.latitude + (latitudeInitialWidth / 2),
        max_longitude: location.longitude + (longitudeInitialWidth / 2),
    };
    dispatch(loadPictureRequests(bbox, 10, 0));
}

export const updateLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    dispatch(locationSlice.actions.updateLocation(location));
}
