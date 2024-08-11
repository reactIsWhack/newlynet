import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

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
  'clubChat/join',
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
      });
  },
});

export default clubChatSlice.reducer;

export const { setClubChatMembers, setSelectedClubChat, setOnlineServerUsers } =
  clubChatSlice.actions;

export const selectClubChat = (state) => state.clubChat;
