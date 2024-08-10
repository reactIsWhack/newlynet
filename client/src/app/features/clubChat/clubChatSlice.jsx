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

const clubChatSlice = createSlice({
  name: 'clubChat',
  initialState,
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
      });
  },
});

export default clubChatSlice.reducer;

export const selectClubChat = (state) => state.clubChat;
