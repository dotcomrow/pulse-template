import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ErrorDTO {
    error: string | null;
    details: string | null;
    exception: any | null;
}

const initialState: ErrorDTO = {
    error: null,
    details: null,
    exception: null
};

export const errorSlice = createAppSlice({
    name: "error",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setError : create.reducer((state, action: PayloadAction<ErrorDTO>) => {
            state.error = action.payload.error;
            state.details = action.payload.details;
            state.exception = action.payload.exception;
        }),
    }),
    selectors: {
        selectError: (state) => state
    },
});

export const { 
    selectError
} = errorSlice.selectors;

export const setError  = (error: ErrorDTO): AppThunk => async (dispatch) => {
    dispatch(errorSlice.actions.setError(error));
}

export const clearError = (): AppThunk => async (dispatch) => {
    dispatch(errorSlice.actions.setError(initialState));
}