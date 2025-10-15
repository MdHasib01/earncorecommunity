import { configureStore } from "@reduxjs/toolkit";
import lmsReducer from "../lms/store/lms.slice";
import { lmsApi } from "../lms/store/lms.api";
import { feedApi } from "./features/feed/feedApi";
import likesReducer from "./features/feed/likesSlice";
import { communityApi } from "./features/community/communityApi";
import authSlice from "./features/authentication/authSlice";
import { authApi } from "./features/authentication/authApi";
import { profileApi } from "./features/profile/profileAPI";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    lms: lmsReducer,
    likes: likesReducer,
    [lmsApi.reducerPath]: lmsApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      lmsApi.middleware,
      feedApi.middleware,
      profileApi.middleware,
      communityApi.middleware,
      authApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
