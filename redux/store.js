import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import viewReducer from './viewSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    view: viewReducer,
  },
});