// import { useDispatch, useSelector, useStore } from "react-redux";
import { useDispatch, TypedUseSelectorHook, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from "@lib/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore.withTypes<AppStore>();