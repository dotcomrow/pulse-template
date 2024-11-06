import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LocationDTO {
    latitude: number;
    longitude: number;
    deviceLocation: boolean;
}

const initialState: LocationDTO = {
    latitude: -1,
    longitude: -1,
    deviceLocation: false,
};

export const deviceLocationSlice = createAppSlice({
    name: "deviceLocation",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setDeviceLocation: create.reducer((state, action: PayloadAction<LocationDTO>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.deviceLocation = action.payload.deviceLocation;
        }),
    }),
    selectors: {
        selectDeviceLocation: (state) => state
    },
});

export const {
    selectDeviceLocation
} = deviceLocationSlice.selectors;

export const setDeviceLocation = (location: LocationDTO): AppThunk => async (dispatch) => {
    dispatch(deviceLocationSlice.actions.setDeviceLocation(location));
}
