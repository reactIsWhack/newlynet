import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  topic: '',
  members: [],
  topicMessages: [],
  generalMessages: [],
  activatedAt: '',
  clubChatLoading: false,
  nextTopic: '',
};

export const getActiveClubChat = createAsyncThunk(
  'clubChat/getActive',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/club-chat/activeclubchat`
      );
      const { user } = thunkAPI.getState();
      return { data: response.data, schoolId: user.school.schoolId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const joinClubChat = createAsyncThunk(
  'clubChat/join',
  async (_, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${baseURL}/api/club-chat/joinclubchat`
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
      state.members = [...state.members, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveClubChat.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(getActiveClubChat.fulfilled, (state, action) => {
        state.topic = action.payload.data.clubChat.chatTopic;
        state.activatedAt = action.payload.data.clubChat.updatedAt;
        state.members = action.payload.data.clubChat.members.filter(
          (member) => member.school.schoolId === action.payload.schoolId
        );
        state.nextTopic = action.payload.data.nextTopic;
        state.clubChatLoading = false;
      })
      .addCase(getActiveClubChat.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload);
      })
      .addCase(joinClubChat.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(joinClubChat.fulfilled, (state, action) => {
        state.members = action.payload.members;
        toast.success(`Joined ${state.topic} club hour!`);
        state.clubChatLoading = false;
      })
      .addCase(joinClubChat.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload);
      });
  },
});

export default clubChatSlice.reducer;

export const { setClubChatMembers } = clubChatSlice.actions;

export const selectClubChat = (state) => state.clubChat;
