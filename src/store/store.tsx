import { configureStore } from '@reduxjs/toolkit';
import rentItemsSlice from "./rentItems";

export const store = configureStore({
  reducer: {
    rentItems: rentItemsSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
