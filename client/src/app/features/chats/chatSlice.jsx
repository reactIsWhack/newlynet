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
      console.log(response, 'conversations');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createChat = createAsyncThunk(
  'user/createChat',
  async ({ chatData, navigate }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/chats/createchat`,
        chatData
      );
      return { data: response.data, navigate };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setSelectedChat(state, action) {
      state.selectedConversation = action.payload;
    },
    setConversations(state, action) {
      state.conversations = [action.payload, ...state.conversations];
    },
  },
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
      })
      .addCase(createChat.pending, (state, action) => {
        state.chatsLoading = true;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chatsLoading = false;
        state.conversations = [action.payload.data, ...state.conversations];
        state.selectedConversation = action.payload.data;
        action.payload.navigate(`/chats/${action.payload.data._id}`);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.chatsLoading = false;
        toast.error(action.payload);
      });
  },
});

export default chatsSlice.reducer;

export const { setSelectedChat, setConversations } = chatsSlice.actions;

export const selectChats = (state) => state.chats;
