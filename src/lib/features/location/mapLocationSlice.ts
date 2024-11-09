import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset } from "@lib/features/map/mapSlice";
import Constants from "@utils/constants";


export interface LocationDTO {
    latitude: number;
    longitude: number;
    zoom: number;
}

const initialState: LocationDTO = {
    latitude: -1,
    longitude: -1,
    zoom: 17
};

export const mapLocationSlice = createAppSlice({
    name: "location",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setLocation: create.reducer((state, action: PayloadAction<LocationDTO>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.zoom = action.payload.zoom;
        }),
    }),
    selectors: {
        selectMapLocation: (state) => state
    },
});

export const {
    selectMapLocation
} = mapLocationSlice.selectors;

export const setMapLocation = (location: LocationDTO): AppThunk => async (dispatch, getState) => {
    dispatch(mapLocationSlice.actions.setLocation(location));
    // lat and lon are reversed here because Google Bigquery uses lon then lat
    const bbox: BoundingBox = {
        min_latitude: location.longitude - (Constants.MapConstants.longitudeInitialWidth / 2),
        min_longitude: location.latitude - (Constants.MapConstants.latitudeInitialWidth / 2),
        max_latitude: location.longitude + (Constants.MapConstants.longitudeInitialWidth / 2),
        max_longitude: location.latitude + (Constants.MapConstants.latitudeInitialWidth / 2),
    };
    const state = getState();
    const limit = selectLimit(state);
    const offset = selectOffset(state);
    // do not reference this working with openlayers
    dispatch(loadPictureRequests(bbox, limit, offset));
}

export const updateMapLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    dispatch(mapLocationSlice.actions.setLocation(location));
}
