import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import commentReducer from "./slices/commentSlice";
import themeReducer from "./slices/themeSlice";
import toastReducer from "./slices/toastSlice";

/**
 * Redux store configuration
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    comments: commentReducer,
    theme: themeReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
