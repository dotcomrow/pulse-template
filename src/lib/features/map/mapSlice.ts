import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import fetchPictureRequests from "services/map/FetchPictureRequests";

export interface MapSliceState {
    pictureRequests: Array<any>;
    pictureRequestStatus: "idle" | "loading" | "failed" | "complete";
}

const initialState: MapSliceState = {
    pictureRequests: [],
    pictureRequestStatus: "idle",
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
            state.pictureRequestStatus = "complete";
        }),
        setPictureRequestStatus: create.reducer((state, action: PayloadAction<"idle" | "loading" | "failed" | "complete">) => {
            state.pictureRequestStatus = action.payload;
        }),
    }),
    selectors: {
        selectPictureRequestStatus: (state) => state.pictureRequestStatus,
        selectPictureRequests: (state) => {
            const returnObj = {
                type: "FeatureCollection",
                features: state.pictureRequests.map((request) => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [request.longitude, request.latitude],
                        },
                        properties: {
                            request_id: request.request_id,
                        },
                    };
                }),
            }
            return returnObj;
        }
    },
});

export const { selectPictureRequests, selectPictureRequestStatus } = mapSlice.selectors;

export const loadPictureRequests = (bbox: BoundingBox): AppThunk => async (dispatch) => {
    try {
        fetchPictureRequests(bbox).then((pictureRequests) => {
            console.log("pictureRequests", pictureRequests.data.fetchPictureRequestsByBoundingBox);
            dispatch(mapSlice.actions.initPictureRequests(pictureRequests.data.fetchPictureRequestsByBoundingBox));
        });
    } catch (error) {
      dispatch(mapSlice.actions.setPictureRequestStatus("failed"));
    }
  }