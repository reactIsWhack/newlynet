import {
  createSlice,
  createAsyncThunk,
  isActionCreator,
} from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  getCommonNewStudents,
  resetStudents,
  setChattingWith,
} from '../user/userSlice';
import sendMessageSound from '../../../assets/sendMessage.wav';
import sortByNewest from '../../../utils/sortByNewest';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const initialState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  chatsLoading: false,
  createMsgLoading: false,
  chatFilter: '',
  err: null,
  contactConversations: [], // an array of chats strictly for chats with a user's contacts
};

export const getConversations = createAsyncThunk(
  'chats/getConversations',
  async (chatType, thunkAPI) => {
    try {
      const { user, chats } = thunkAPI.getState();
      const response = await axios.get(
        `${baseUrl}/api/chats/getchats/${chatType || 'individual'}`
      );
      if (
        (chatType === '' || chatType === 'individual') &&
        !chats.contactConversations.length // when the page first loads and the state chats are empty arrays, fill the contact conversations
      )
        await thunkAPI.dispatch(setContactChats(response.data));
      console.log(response.data);
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
      thunkAPI.dispatch(
        setChattingWith(response.data.members.map((member) => member._id))
      );
      thunkAPI.dispatch(resetMessages());
      return response.data;
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
    reorderChats(state, action) {
      if (state.chatFilter === action.payload.chatFilter)
        state.conversations = action.payload;
    },
    setChatFilter(state, action) {
      state.chatFilter = action.payload;
    },
    resetConversations(state, action) {
      state.conversations = [];
    },
    resetChatState(state, action) {
      return initialState;
    },
    setContactChats(state, action) {
      state.contactConversations = action.payload;
    },
    overideChats(state, action) {
      state.conversations = action.payload;
    },
    updateConversationStreak(state, action) {
      const conversation = state.conversations.find(
        (conversation) => conversation._id === action.payload.chat._id
      );
      conversation.streak++;
      conversation.accomplishedDailyStreak = action.payload.metaData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.chatsLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        console.log(action.payload);
        state.chatsLoading = false;
        const sorted = sortByNewest([...action.payload], 'read');
        state.conversations = sorted;
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
        state.chatFilter = action.payload.chatType;
        if (
          state.chatFilter === action.payload.chatType ||
          state.chatFilter === ''
        ) {
          state.conversations = [action.payload, ...state.conversations];
          state.selectedConversation = action.payload;
        }
        if (action.payload.chatType === 'individual')
          state.contactConversations = [
            ...state.contactConversations,
            action.payload,
          ];
      })
      .addCase(createChat.rejected, (state, action) => {
        state.err = action.payload;
        state.chatsLoading = false;
        toast.error(action.payload);
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.createMsgLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.createMsgLoading = false;
        const audio = new Audio(sendMessageSound);
        audio.play();
        state.messages = [...state.messages, action.payload.newMessage];
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

export const {
  setSelectedChat,
  setConversations,
  resetMessages,
  setMessages,
  reorderChats,
  setChatFilter,
  resetChatState,
  resetConversations,
  setContactChats,
  overideChats,
  updateConversationStreak,
} = chatsSlice.actions;

export const selectChats = (state) => state.chats;
