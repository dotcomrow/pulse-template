import { createAppSlice } from "@lib/createAppSlice";
import type { AppThunk } from "@lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import fetchAccountInfo from "@utils/AuthenticationUtility";

export interface UserSliceState {
  user: any;
  profile: any;
  status: "idle" | "loading" | "failed";
}



const initialState: UserSliceState = {
  user: {},
  profile: {},
  status: "idle",
};



// If you are not using async thunks you can use the standalone `createSlice`.
export const userSlice = createAppSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    initUser: create.reducer((state, action: PayloadAction<any>) => {
      state.user = action.payload;
    }),
    initProfile: create.reducer((state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    }),
    // increment: create.reducer((state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // }),
    // decrement: create.reducer((state) => {
    //   state.value -= 1;
    // }),
    // // Use the `PayloadAction` type to declare the contents of `action.payload`
    // incrementByAmount: create.reducer(
    //   (state, action: PayloadAction<number>) => {
    //     state.value += action.payload;
    //   },
    // ),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    // incrementAsync: create.asyncThunk(
    //   async (amount: number) => {
    //     const response = await fetchCount(amount);
    //     // The value we return becomes the `fulfilled` action payload
    //     return response.data;
    //   },
    //   {
    //     pending: (state) => {
    //       state.status = "loading";
    //     },
    //     fulfilled: (state, action) => {
    //       state.status = "idle";
    //       state.value += action.payload;
    //     },
    //     rejected: (state) => {
    //       state.status = "failed";
    //     },
    //   },
    // ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectUser: (state) => {
      return state.user;
    },
  },
});

// Action creators are generated for each case reducer function.
// export const { decrement, increment, incrementByAmount, incrementAsync } =
//   userSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUser } = userSlice.selectors;
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export const initializeUser = (token: string): AppThunk => async (dispatch) => {
  var accountResponse = await fetchAccountInfo(token);
  dispatch(userSlice.actions.initUser(accountResponse));
}

export const initializeProfile = (token: string): AppThunk => async (dispatch) => {
  // var profileResponse = await AuthenticationUtility.fetchProfileInfo(token);
  dispatch(userSlice.actions.initProfile());
}