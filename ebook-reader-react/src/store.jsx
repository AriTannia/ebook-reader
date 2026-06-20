import {configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import messageReducer from './reducers/message';

const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
  },
});

export default store;