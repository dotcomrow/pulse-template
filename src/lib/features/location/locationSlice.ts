import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset } from "@lib/features/map/mapSlice";

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
    // lat and lon are reversed here because Google Bigquery uses lon then lat
    const bbox: BoundingBox = {
        min_latitude: location.longitude - (longitudeInitialWidth / 2),
        min_longitude: location.latitude - (latitudeInitialWidth / 2),
        max_latitude: location.longitude + (longitudeInitialWidth / 2),
        max_longitude: location.latitude + (latitudeInitialWidth / 2),
    };
    // do not reference this working with openlayers
    console.log(bbox);
    dispatch(loadPictureRequests(bbox, 10, 0));
}

export const updateLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    dispatch(locationSlice.actions.updateLocation(location));
}
