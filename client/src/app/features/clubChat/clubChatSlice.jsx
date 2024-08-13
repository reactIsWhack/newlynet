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
  createClubMsgLoading: false,
  paginating: false,
  customClubServers: [],
  clubChatFilter: 'suggested',
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
    const {
      clubChat: { dateQuery },
    } = thunkAPI.getState();
    try {
      const date = dateQuery
        ? new Date(dateQuery)
        : Date.parse(new Date(Date.now()));
      const response = await axios.get(
        `${baseURL}/api/club-chat/${chatId}/${date}`
      );
      console.log(response.data);
      return { data: response.data, paginating: dateQuery !== null };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const sendClubChatMessage = createAsyncThunk(
  'clubChat/sendMessage',
  async (formData, thunkAPI) => {
    try {
      const {
        clubChat: { serverId },
      } = thunkAPI.getState();
      const response = await axios.post(
        `${baseURL}/api/club-chat/${serverId}`,
        {
          message: formData.get('message'),
          chatSection: formData.get('chatSection'),
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getCustomClubServers = createAsyncThunk(
  'clubChat/customServers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/api/clubserver/allservers`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createCustomClubServer = createAsyncThunk(
  'clubChat/createCustom',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${baseURL}/api/clubserver`, formData);
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
      state.dateQuery = null;
    },
    setclubChatMessages(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    setDateQuery(state, action) {
      state.dateQuery = action.payload.dateQuery;
    },
    resetClubChatState(state) {
      return initialState;
    },
    setClubChatFilter(state, action) {
      state.clubChatFilter = action.payload;
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

        if (!action.payload.paginating) {
          state.messages = action.payload.data.reverse();
        } else {
          state.paginating = true;
          state.messages = [
            ...action.payload.data.reverse().map((msg) => {
              msg.shouldShake = true;
              return msg;
            }),
            ...state.messages,
          ];
        }

        if (action.payload.data.length) {
          state.dateQuery = action.payload.data[0].createdAt;
        } else state.dateQuery = '';
      })
      .addCase(getClubChatMessages.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload);
      })
      .addCase(sendClubChatMessage.pending, (state) => {
        state.createClubMsgLoading = true;
      })
      .addCase(sendClubChatMessage.fulfilled, (state, action) => {
        state.createClubMsgLoading = false;
        const audio = new Audio(sendMessageSound);
        audio.play();
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendClubChatMessage.rejected, (state, action) => {
        state.createClubMsgLoading = false;
        toast.error(action.payload, { id: 'club-msg-error' });
      })
      .addCase(getCustomClubServers.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(getCustomClubServers.fulfilled, (state, action) => {
        state.clubChatLoading = false;
        state.customClubServers = action.payload;
      })
      .addCase(getCustomClubServers.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload, { id: 'club-msg-error' });
      })
      .addCase(createCustomClubServer.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(createCustomClubServer.fulfilled, (state, action) => {
        state.clubChatLoading = false;
        state.customClubServers = [action.payload, ...state.customClubServers];
      })
      .addCase(createCustomClubServer.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload, { id: 'club-custom-err' });
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
  setDateQuery,
  resetClubChatState,
  setClubChatFilter,
} = clubChatSlice.actions;

export const selectClubChat = (state) => state.clubChat;
