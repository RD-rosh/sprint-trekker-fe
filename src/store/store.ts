import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import organizationReducer from './slices/organizationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // organizations: organizationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;