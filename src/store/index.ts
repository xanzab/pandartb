import { configureStore } from '@reduxjs/toolkit';
import listReducer from './slices/listSlice';

export const store = configureStore({
  reducer: {
    list: listReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
