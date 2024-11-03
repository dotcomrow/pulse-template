import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export interface NotificationDTO {
    title: string | null;
    message: ReactNode | null;
    severity: "info" | "warning" | "error" | "success" | null;
    icon: "info" | "warning" | "error" | "success" | null;
    confirmAction: any | null;
    denyAction: any | null;
    show: boolean;
}

const initialState: NotificationDTO = {
    title: null,
    message: null,
    severity: null,
    icon: null,
    confirmAction: null,
    denyAction: null,
    show: false,
};

export const notificationSlice = createAppSlice({
    name: "notification",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        setNotification : create.reducer((state, action: PayloadAction<NotificationDTO>) => {
            state.title = action.payload.title;
            state.message = action.payload.message;
            state.severity = action.payload.severity;
            state.icon = action.payload.icon;
            state.confirmAction = action.payload.confirmAction;
            state.denyAction = action.payload.denyAction;
            state.show = action.payload.show;
        }),
    }),
    selectors: {
        selectNotification: (state) => state
    },
});

export const { 
    selectNotification
} = notificationSlice.selectors;

export const setNotification  = (notification: NotificationDTO): AppThunk => async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(notification));
}

export const clearNotification = (): AppThunk => async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(initialState));
}