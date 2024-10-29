import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import fetchPictureRequests from "@services/map/FetchPictureRequests";
import CircleStyle from 'ol/style/Circle';
import { Fill, Stroke, Style } from 'ol/style';
import WKT from 'ol/format/WKT';

const wktRead = new WKT();

export interface MapSliceState {
    pictureRequests: Array<any>;
    pictureRequestStatus: "idle" | "loading" | "failed" | "complete";
}

const initialState: MapSliceState = {
    pictureRequests: [],
    pictureRequestStatus: "idle",
};

export interface BoundingBox {
    min_latitude: number; // Minimum latitude
    min_longitude: number; // Minimum longitude
    max_latitude: number; // Maximum latitude
    max_longitude: number; // Maximum longitude
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
            if (state.pictureRequests == null) {
                return [];
            } else {
                try {
                    return state.pictureRequests.map((request) => {
                        var retFeature = wktRead.readFeature(request.location);
                        retFeature.setStyle(new Style({
                            image: new CircleStyle({
                                radius: 10,
                                fill: new Fill({
                                    color: 'rgba(0, 0, 255, 0.1)',
                                }),
                                stroke: new Stroke({
                                    color: 'rgba(0, 0, 255, 0.3)',
                                    width: 1,
                                }),
                            }),
                        }));
                        retFeature.setProperties({
                            request_title: request.request_title,
                            request_description: request.request_description,
                            bid_type: request.bid_type,
                            capture_timestamp: request.capture_timestamp,
                            direction: request.direction,
                        });
                        retFeature.setId(request.request_id);
                        return retFeature;
                    });
                } catch (error) {
                    return [];
                }
            }
        }
    },
});

export const { selectPictureRequests, selectPictureRequestStatus } = mapSlice.selectors;

export const loadPictureRequests = (bbox: BoundingBox): AppThunk => async (dispatch) => {
    try {
        fetchPictureRequests(bbox).then((pictureRequests) => {
            dispatch(mapSlice.actions.initPictureRequests(pictureRequests.data.fetchPictureRequestsByBoundingBox));
        });
    } catch (error) {
        dispatch(mapSlice.actions.setPictureRequestStatus("failed"));
    }
}