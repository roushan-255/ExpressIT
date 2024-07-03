import { configureStore } from '@reduxjs/toolkit';

import ActivitySliceReducer from './slices/ActivitySlice.js';
import authSliceReducer from "./slices/AuthSlice.js";
import themeSliceReducer from "./slices/ThemeSlice.js";
import postSliceReducer from "./slices/PostSlice.js";
import userSliceReducer from "./slices/UserSlice.js";


const store = configureStore({
    reducer: {
        theme: themeSliceReducer,
        auth: authSliceReducer,
        post: postSliceReducer,
        user: userSliceReducer,
        activity: ActivitySliceReducer
    },
    devTools: true,
});

export default store;