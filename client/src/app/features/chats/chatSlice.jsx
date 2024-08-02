import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getCommonNewStudents, resetStudents } from '../user/userSlice';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const initialState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  chatsLoading: false,
  createMsgLoading: false,
};

export const getConversations = createAsyncThunk(
  'chats/getConversations',
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
  'chats/createChat',
  async ({ chatData, navigate }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/chats/createchat`,
        chatData
      );
      thunkAPI.dispatch(resetStudents());
      await thunkAPI.dispatch(
        getCommonNewStudents({ filter: 'grade', cursor: '' })
      );
      const cb = (path) => navigate(path);
      return { data: response.data, cb };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({ chatId, message }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/message/sendmessage/${chatId}`,
        { message }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  'chats/getMessages',
  async (chatId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/message/messages/${chatId}`
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
  reducers: {
    setSelectedChat(state, action) {
      state.selectedConversation = action.payload;
    },
    setConversations(state, action) {
      state.conversations = [action.payload, ...state.conversations];
    },
    resetMessages(state) {
      state.messages = [];
    },
    setMessages(state, action) {
      state.messages = [...state.messages, action.payload];
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
        action.payload.cb(`/chats/${action.payload.data._id}`);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.chatsLoading = false;
        toast.error(action.payload);
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.createMsgLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.createMsgLoading = false;
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.createMsgLoading = false;
        toast.error(action.payload);
      })
      .addCase(getMessages.pending, (state, action) => {
        state.chatsLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.chatsLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.chatsLoading = false;
        toast.error(action.payload);
      });
  },
});

export default chatsSlice.reducer;

export const { setSelectedChat, setConversations, resetMessages, setMessages } =
  chatsSlice.actions;

export const selectChats = (state) => state.chats;
