import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const initialState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  chatsLoading: false,
};

export const getConversations = createAsyncThunk(
  'user/getConversations',
  async (chatType, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/chats/getchats/${chatType}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.chatsLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.chatsLoading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.chatsLoading = false;
        toast.error(action.payload);
      });
  },
});

export default chatsSlice.reducer;

export const selectChats = (state) => state.chats;
