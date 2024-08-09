import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import chatReducer from './features/chats/chatSlice';
import popupReducer from './features/popup/popupSlice';
import clubChatReducer from './features/clubChat/clubChatSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatReducer,
    popup: popupReducer,
    clubChat: clubChatReducer,
  },
});

export default store;
