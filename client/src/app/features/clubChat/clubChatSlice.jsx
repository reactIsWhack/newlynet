import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import sendMessageSound from '../../../assets/sendMessage.wav';

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  topic: '',
  members: [],
  messages: [],
  chats: [],
  activatedAt: '',
  clubChatLoading: false,
  nextTopic: '',
  serverId: '',
  selectedClubChat: null,
  onlineServerUsers: [],
  dateQuery: null,
  createMsgLoading: false,
};

export const getClubServer = createAsyncThunk(
  'clubServer/getData',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/api/clubserver`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const joinClubServer = createAsyncThunk(
  'clubServer/join',
  async (_, thunkAPI) => {
    try {
      const { clubChat } = thunkAPI.getState();
      const response = await axios.patch(
        `${baseURL}/api/clubserver/${clubChat.serverId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getClubChatMessages = createAsyncThunk(
  'clubChat/getMessages',
  async (chatId, thunkAPI) => {
    try {
      const {
        clubChat: { dateQuery },
      } = thunkAPI.getState();
      const date = dateQuery ? dateQuery : Date.parse(new Date(Date.now()));
      console.log(date, chatId);
      const response = await axios.get(
        `${baseURL}/api/club-chat/${chatId}/${date}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const sendClubChatMessage = createAsyncThunk(
  'clubChat/sendMessage',
  async (formData, thunkAPI) => {
    console.log(formData.get('message'));
    try {
      const {
        clubChat: { serverId },
      } = thunkAPI.getState();
      console.log(serverId);
      const response = await axios.post(
        `${baseURL}/api/club-chat/${serverId}`,
        {
          message: formData.get('message'),
          chatSection: formData.get('chatSection'),
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const clubChatSlice = createSlice({
  name: 'clubChat',
  initialState,
  reducers: {
    setClubChatMembers(state, action) {
      state.members = action.payload;
    },
    setSelectedClubChat(state, action) {
      state.selectedClubChat = action.payload;
    },
    setOnlineServerUsers(state, action) {
      state.onlineServerUsers = action.payload;
    },
    resetClubChatMessages(state, action) {
      state.messages = [];
    },
    setclubChatMessages(state, action) {
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClubServer.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(getClubServer.fulfilled, (state, action) => {
        state.clubChatLoading = false;
        state.members = action.payload.members;
        state.chats = action.payload.chats.reverse();
        state.serverId = action.payload._id;
      })
      .addCase(getClubServer.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload);
      })
      .addCase(joinClubServer.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(joinClubServer.fulfilled, (state, action) => {
        state.clubChatLoading = false;
        state.members = action.payload.members;
        toast.success("Welcome to your school's club server");
      })
      .addCase(joinClubServer.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload);
      })
      .addCase(getClubChatMessages.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(getClubChatMessages.fulfilled, (state, action) => {
        state.clubChatLoading = false;
        if (!state.dateQuery) {
          state.messages = action.payload.reverse();
        } else {
          state.messages = [...action.payload.reverse(), ...state.messages];
        }

        if (action.payload.length === 20)
          state.dateQuery = action.payload[action.payload.length - 1].createdAt;
        else state.dateQuery = '';
      })
      .addCase(getClubChatMessages.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload);
      })
      .addCase(sendClubChatMessage.pending, (state) => {
        state.createMsgLoading = true;
      })
      .addCase(sendClubChatMessage.fulfilled, (state, action) => {
        state.createMsgLoading = false;
        const audio = new Audio(sendMessageSound);
        audio.play();
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendClubChatMessage.rejected, (state, action) => {
        state.createMsgLoading = false;
        toast.error(action.payload);
      });
  },
});

export default clubChatSlice.reducer;

export const {
  setClubChatMembers,
  setSelectedClubChat,
  setOnlineServerUsers,
  resetClubChatMessages,
  setclubChatMessages,
} = clubChatSlice.actions;

export const selectClubChat = (state) => state.clubChat;
