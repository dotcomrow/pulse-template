import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialLocationDTO {
    latitude: number;
    longitude: number;
    deviceLocation: boolean;
    locationPermissionsAllowed: boolean;
}

const initialState: InitialLocationDTO = {
    latitude: -1,
    longitude: -1,
    deviceLocation: false,
    locationPermissionsAllowed: false
};

export const initialLocationSlice = createAppSlice({
    name: "initialLocation",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setInitialLocation : create.reducer((state, action: PayloadAction<InitialLocationDTO>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.deviceLocation = action.payload.deviceLocation;
            state.locationPermissionsAllowed = action.payload.locationPermissionsAllowed;
        }),
    }),
    selectors: {
        selectInitialLocation: (state) => state
    },
});

export const { 
    selectInitialLocation
} = initialLocationSlice.selectors;

export const setInitialLocation  = (initialLocation: InitialLocationDTO): AppThunk => async (dispatch) => {
    dispatch(initialLocationSlice.actions.setInitialLocation(initialLocation));
}
