import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import categoryReducer from './slices/categories.slice';
import menuItemsReducer from './slices/menuItem.slice'
import CustomerReducer from './slices/customer.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    menuItems: menuItemsReducer,
    customer:CustomerReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
