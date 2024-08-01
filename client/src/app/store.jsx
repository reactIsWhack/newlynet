import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import chatReducer from './features/chats/chatSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatReducer,
  },
});

export default store;
