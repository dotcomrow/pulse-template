import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import fetchPictureRequests from "@services/map/FetchPictureRequests";
import { Fill, Icon, Stroke, Style } from 'ol/style';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Constants from "@utils/constants";

const wktRead = new WKT();

export interface MapSliceState {
    pictureRequests: Array<any>;
    pictureRequestStatus: "idle" | "loading" | "failed" | "complete";
    limit: number;
    offset: number;
}

const initialState: MapSliceState = {
    pictureRequests: [],
    pictureRequestStatus: "idle",
    limit: Constants.MapRequestConstants.itemsPerPage,
    offset: 0
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
        setLimit: create.reducer((state, action: PayloadAction<number>) => {
            state.limit = action.payload;
        }),
        setOffset: create.reducer((state, action: PayloadAction<number>) => {
            state.offset = action.payload;
        }),
    }),
    selectors: {
        selectPictureRequestStatus: (state) => state.pictureRequestStatus,
        selectLimit: (state) => state.limit,
        selectOffset: (state) => state.offset,
        selectPictureRequests: (state): Feature<Geometry>[] => {
            if (state.pictureRequests == null) {
                return [] as Feature<Geometry>[];
            } else {
                try {
                    return state.pictureRequests.map((request) => {
                        var retFeature = wktRead.readFeature(request.location);
                        retFeature.setStyle(new Style({
                            image: new Icon({
                                opacity: 1,
                                src: "/assets/images/icons/camera.svg",
                                scale: 1.3
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
                    return [] as Feature<Geometry>[];
                }
            }
        },
    },
});

export const {
    selectPictureRequests,
    selectPictureRequestStatus,
    selectLimit,
    selectOffset
} = mapSlice.selectors;

export const loadPictureRequests = (bbox: BoundingBox, limit: number, offset: number): AppThunk => async (dispatch) => {
    try {
        dispatch(mapSlice.actions.setPictureRequestStatus("loading"));
        fetchPictureRequests(bbox, limit, offset).then((pictureRequests) => {
            dispatch(mapSlice.actions.initPictureRequests(pictureRequests.data.fetchPictureRequestsByBoundingBox));
        });
    } catch (error) {
        dispatch(mapSlice.actions.setPictureRequestStatus("failed"));
    }
}

export const changePage = (page: number): AppThunk => async (dispatch, getState) => {
    const limit = selectLimit(getState());
    const offset = (page - 1) * limit;
    dispatch(mapSlice.actions.setOffset(offset));
    dispatch(loadPictureRequests({
        min_latitude: 0,
        min_longitude: 0,
        max_latitude: 0,
        max_longitude: 0
    }, limit, offset));
}