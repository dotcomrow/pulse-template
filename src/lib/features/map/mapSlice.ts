import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import fetchPictureRequests from "services/map/FetchPictureRequests";

export interface MapSliceState {
    pictureRequests: Array<any>;
    status: "idle" | "loading" | "failed" | "complete";
}

const initialState: MapSliceState = {
    pictureRequests: [],
    status: "idle",
};

export interface BoundingBox {
    minLat: number; // Minimum latitude
    minLng: number; // Minimum longitude
    maxLat: number; // Maximum latitude
    maxLng: number; // Maximum longitude
}

export const mapSlice = createAppSlice({
    name: "map",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        initPictureRequests: create.reducer((state, action: PayloadAction<Array<any>>) => {
            state.pictureRequests = action.payload;
            state.status = "complete";
        }),
        setStatus: create.reducer((state, action: PayloadAction<"idle" | "loading" | "failed" | "complete">) => {
            state.status = action.payload;
        }),
    }),
    selectors: {
        selectPictureRequests: (state) => state.pictureRequests,
    },
});

export const { selectPictureRequests } = mapSlice.selectors;

export const loadPictureRequests = (bbox: BoundingBox): AppThunk => async (dispatch) => {
    try {
        fetchPictureRequests(bbox).then((pictureRequests) => {
            dispatch(mapSlice.actions.initPictureRequests(pictureRequests));
        });
    } catch (error) {
      dispatch(mapSlice.actions.setStatus("failed"));
    }
  }