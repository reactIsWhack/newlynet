import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import sendMessageSound from '../../../assets/sendMessage.wav';

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  members: [],
  messages: [],
  chats: [],
  clubChatLoading: false,
  serverId: '',
  selectedClubChat: null,
  onlineServerUsers: [],
  dateQuery: null,
  createClubMsgLoading: false,
  paginating: false,
  customClubServers: [],
  suggestedClubServers: [],
  clubChatFilter: 'suggested',
  customServer: {
    members: [],
    chats: [],
    serverId: '',
    serverName: '',
    owner: null,
    admins: [],
  },
  invitePending: false,
  createChannelLoading: false,
  promotionPending: false,
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
  async (serverId, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${baseURL}/api/clubserver/${serverId}`
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
  async ({ formData, serverId }, thunkAPI) => {
    try {
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
      const {
        user: { unreadClubChats },
      } = thunkAPI.getState();
      return { data: response.data, unreadClubChats };
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

export const getSuggestedClubServers = createAsyncThunk(
  'clubChat/suggestedServers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/clubserver/suggestedservers`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const sendServerInvite = createAsyncThunk(
  'clubChat/sendInvite',
  async ({ serverId, userId }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${baseURL}/api/clubserver/invite/${serverId}/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createServerChannel = createAsyncThunk(
  'clubServer/createChannel',
  async (channelName, thunkAPI) => {
    try {
      const {
        clubChat: { customServer },
      } = thunkAPI.getState();
      const response = await axios.patch(
        `${baseURL}/api/clubserver/newchannel/${customServer.serverId}`,
        { channelName }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const promoteToAdmin = createAsyncThunk(
  'clubServer/addAdmin',
  async (userId, thunkAPI) => {
    try {
      const {
        clubChat: { customServer },
      } = thunkAPI.getState();
      const response = await axios.patch(
        `${baseURL}/api/clubserver/addadmin/${customServer.serverId}/${userId}`
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
    resetClubChatMessages(state, action) {
      state.messages = [];
      state.dateQuery = null;
      state.paginating = false;
    },
    setclubChatMessages(state, action) {
      if (!state.messages.some((msg) => msg._id === action.payload._id)) {
        state.messages = [...state.messages, action.payload];
      }
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
    setCustomServer(state, action) {
      state.customServer = action.payload;
    },
    resetCustomServer(state, action) {
      state.customServer = {
        members: [],
        serverId: '',
        serverName: '',
        chats: [],
      };
    },
    setCustomServerMembers(state, action) {
      const customServer = state.customClubServers.find(
        (server) => server._id === action.payload._id
      );
      customServer.members = action.payload.members;
    },
    removeSuggestedServer(state, action) {
      state.suggestedClubServers = state.suggestedClubServers.filter(
        (server) => server._id !== action.payload
      );
    },
    setServerChannels(state, action) {
      state.customServer.chats = action.payload.chats;
    },
    setServerAdmins(state, action) {
      state.customServer.admins = action.payload;
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
        state.chats = action.payload.chats;
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
        if (!action.payload.custom) {
          state.members = action.payload.members;
          toast.success("Welcome to your school's club server");
        } else {
          state.customClubServers = [
            action.payload,
            ...state.customClubServers,
          ];
          toast.success(`Joined ${action.payload.serverName} Server`);
        }
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
        state.customClubServers = action.payload.data;
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
        toast.success('Club Server Created!');
      })
      .addCase(createCustomClubServer.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload, { id: 'club-custom-err' });
      })
      .addCase(getSuggestedClubServers.pending, (state) => {
        state.clubChatLoading = true;
      })
      .addCase(getSuggestedClubServers.fulfilled, (state, action) => {
        state.clubChatLoading = false;
        state.suggestedClubServers = action.payload;
      })
      .addCase(getSuggestedClubServers.rejected, (state, action) => {
        state.clubChatLoading = false;
        toast.error(action.payload, { id: 'club-custom-err' });
      })
      .addCase(sendServerInvite.pending, (state) => {
        state.invitePending = true;
      })
      .addCase(sendServerInvite.fulfilled, (state, action) => {
        state.invitePending = false;
        toast.success('Server invite sent!');
      })
      .addCase(sendServerInvite.rejected, (state, action) => {
        state.invitePending = false;
        toast.error(action.payload, { id: 'club-custom-err' });
      })
      .addCase(createServerChannel.pending, (state) => {
        state.createChannelLoading = true;
      })
      .addCase(createServerChannel.fulfilled, (state, action) => {
        state.createChannelLoading = false;
        state.customServer.chats = action.payload.chats;
        toast.success('Server channel created!');
      })
      .addCase(createServerChannel.rejected, (state, action) => {
        state.createChannelLoading = false;
        toast.error(action.payload, { id: 'club-custom-err' });
      })
      .addCase(promoteToAdmin.pending, (state) => {
        state.promotionPending = true;
      })
      .addCase(promoteToAdmin.fulfilled, (state, action) => {
        state.promotionPending = false;
        state.customServer.admins = action.payload.admins;
        toast.success('User added as an admin!');
      })
      .addCase(promoteToAdmin.rejected, (state, action) => {
        state.promotionPending = false;
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
  setCustomServer,
  resetCustomServer,
  setCustomServerMembers,
  removeSuggestedServer,
  setServerChannels,
  setServerAdmins,
} = clubChatSlice.actions;

export const selectClubChat = (state) => state.clubChat;
