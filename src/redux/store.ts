import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import categoryReducer from './slices/categories.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
