import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoundingBox, loadPictureRequests, selectLimit, selectOffset } from "@lib/features/map/mapSlice";

const latitudeInitialWidth = 0.0064373;
const longitudeInitialWidth = 0.00786198;

export interface LocationDTO {
    latitude: number;
    longitude: number;
}

const initialState: LocationDTO = {
    latitude: -1,
    longitude: -1,
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
        }),
    }),
    selectors: {
        selectMapLocation: (state) => state
    },
});

export const {
    selectMapLocation
} = mapLocationSlice.selectors;

export const setMapLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    const currentLocation = selectMapLocation({ location: initialState });
    if (currentLocation.latitude != -1 && location.longitude != -1) {
        return;
    }
    dispatch(mapLocationSlice.actions.setLocation(location));
    // lat and lon are reversed here because Google Bigquery uses lon then lat
    const bbox: BoundingBox = {
        min_latitude: location.longitude - (longitudeInitialWidth / 2),
        min_longitude: location.latitude - (latitudeInitialWidth / 2),
        max_latitude: location.longitude + (longitudeInitialWidth / 2),
        max_longitude: location.latitude + (latitudeInitialWidth / 2),
    };
    // do not reference this working with openlayers
    dispatch(loadPictureRequests(bbox, 10, 0));
}

export const updateMapLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    dispatch(mapLocationSlice.actions.setLocation(location));
}
