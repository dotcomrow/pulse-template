import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ErrorDTO {
    errorTitle: string | null;
    errorDetails: string | null;
    exception: any | null;
    errorSeverity: string | null;
    errorIcon?: string | null;
    errorTextStyle: string | null;
}

const initialState: ErrorDTO = {
    errorTitle: null,
    errorDetails: null,
    exception: null,
    errorSeverity: null,
    errorIcon: null,
    errorTextStyle: null
};

export const errorSlice = createAppSlice({
    name: "error",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setError : create.reducer((state, action: PayloadAction<ErrorDTO>) => {
            state.errorTitle = action.payload.errorTitle;
            state.errorDetails = action.payload.errorDetails;
            state.exception = action.payload.exception;
            state.errorSeverity = action.payload.errorSeverity;
            state.errorIcon = action.payload.errorIcon;
            state.errorTextStyle = action.payload.errorTextStyle;
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