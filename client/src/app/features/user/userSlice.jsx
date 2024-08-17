import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = import.meta.env.VITE_SERVER_URL;

const initialState = {
  userId: '',
  username: '',
  contacts: [],
  firstName: '',
  lastName: '',
  profilePicture: '',
  grade: null,
  interests: [],
  school: null,
  socialMediaInfo: { snapchat: '', instagram: '' },
  chattingWith: [],
  isLoading: false,
  isLoggedIn: false,
  commonNewStudents: [],
  unreadChats: [],
  unreadClubChats: [],
  cursor: '',
  updateLoading: false,
  serverInvites: [],
  searchResults: [],
  searchLoading: false,
};

export const signup = createAsyncThunk(
  'user/signup',
  async ({ formData, navigate }, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/signup`, formData);
      if (response.status === 201) navigate('/');
      toast.success('Registered successfully!');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ formData, navigate }, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, formData);
      if (response.status === 200) navigate('/');
      toast.success('Logged in successfully!');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/personalprofile`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/logout`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getCommonNewStudents = createAsyncThunk(
  'user/commonStudents',
  async ({ filter, cursor }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/users/commonstudents/${filter}?cursor=${cursor}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const addContact = createAsyncThunk(
  'user/addContact',
  async (id, thunkAPI) => {
    try {
      const { chats } = thunkAPI.getState();
      const response = await axios.patch(
        `${baseUrl}/api/users/addcontact/${id}`
      );
      if (chats.conversations.some((c) => c.members.some((m) => m._id === id)))
        thunkAPI.dispatch(setChattingWith([id]));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const addSocialMediaInfo = createAsyncThunk(
  'user/socialMediaData',
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/users/addsocialmedia`,
        data
      );
      console.log(response, 'social media data');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/users/updateprofile`,
        data
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const readUnreadClubMessages = createAsyncThunk(
  'clubChat/readUnreads',
  async (chatId, thunkAPI) => {
    try {
      const response = await axios.patch(`${baseUrl}/api/club-chat/${chatId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/search',
  async (searchQuery, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/users/search/${searchQuery}`
      );
      return response.data;
    } catch (error) {
      if (searchQuery.includes('/'))
        return thunkAPI.rejectWithValue('Please remove all / characters');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const sendForgetPasswordEmail = createAsyncThunk(
  'user/forgetPassword',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/forgetpassword`, {
        email,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ newPassword, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/reset-password/${token}`,
        {
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    resetStudents(state, action) {
      state.cursor = '';
      state.commonNewStudents = [];
    },
    setCursor(state, action) {
      state.isLoading = action.payload;
    },
    setUnreadChats(state, action) {
      state.unreadChats = action.payload;
    },
    setChattingWith(state, action) {
      const chattingWithSet = new Set(state.chattingWith);
      chattingWithSet.add(...action.payload);
      state.chattingWith = Array.from(chattingWithSet);
    },
    resetUserState(state) {
      return initialState;
    },
    setUnreadClubChatMessages(state, action) {
      state.unreadClubChats = action.payload;
    },
    setServerInvites(state, action) {
      state.serverInvites = action.payload;
    },
    setContactInvites(state, action) {
      const contact = state.contacts.find(
        (contact) => contact._id === action.payload._id
      );
      contact.serverInvites = action.payload.invites;
      console.log(contact);
    },
    removeServerInvite(state, action) {
      state.serverInvites = state.serverInvites.filter(
        (serverInvite) => serverInvite.server._id !== action.payload
      );
    },
    resetSearchResults(state, action) {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userId = action.payload._id;
        state.interests = action.payload.interests;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.contacts = action.payload.contacts;
        state.profilePicture = action.payload.profilePicture;
        state.grade = action.payload.grade;
        state.school = action.payload.school;
        state.username = action.payload.username;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload, { id: 'signup-err' });
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userId = action.payload._id;
        state.interests = action.payload.interests;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.contacts = action.payload.contacts;
        state.profilePicture = action.payload.profilePicture;
        state.grade = action.payload.grade;
        state.school = action.payload.school;
        state.chattingWith = action.payload.chattingWith;
        state.socialMediaInfo = action.payload.socialMediaUsernames;
        state.username = action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload._id;
        state.interests = action.payload.interests;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.contacts = action.payload.contacts;
        state.profilePicture = action.payload.profilePicture;
        state.grade = action.payload.grade;
        state.school = action.payload.school;
        state.chattingWith = action.payload.chattingWith;
        state.unreadChats = action.payload.unreadChats;
        state.socialMediaInfo = action.payload.socialMediaUsernames;
        state.username = action.payload.username;
        state.unreadClubChats = action.payload.unreadClubChatMessages;
        console.log(action.payload.serverInvites);
        state.serverInvites = action.payload.serverInvites;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.commonNewStudents = [];
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(getCommonNewStudents.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCommonNewStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commonNewStudents = [
          ...state.commonNewStudents,
          ...action.payload,
        ];
      })
      .addCase(getCommonNewStudents.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(addContact.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        toast.success('Contact added!');
        state.isLoading = false;
        state.contacts = action.payload.contacts;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(addSocialMediaInfo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addSocialMediaInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success('Social media tags updated!');
        state.socialMediaInfo = action.payload.socialMediaUsernames;
      })
      .addCase(addSocialMediaInfo.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        toast.success('Profile updated!');
        state.grade = action.payload.grade;
        state.interests = action.payload.interests;
        state.school = action.payload.school;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        toast.error(action.payload);
      })
      .addCase(readUnreadClubMessages.fulfilled, (state, action) => {
        state.unreadClubChats = action.payload.unreadClubChatMessages;
      })
      .addCase(readUnreadClubMessages.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        toast.error(action.payload, { id: '/-error' });
      })
      .addCase(sendForgetPasswordEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendForgetPasswordEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(sendForgetPasswordEmail.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload, { id: '/-error' });
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload, { id: '/reset-err' });
      });
  },
});

export default userSlice.reducer;

export const {
  setIsLoggedIn,
  resetStudents,
  setCursor,
  setUnreadChats,
  setChattingWith,
  resetUserState,
  setUnreadClubChatMessages,
  setServerInvites,
  setContactInvites,
  resetSearchResults,
  removeServerInvite,
} = userSlice.actions;

export const selectUser = (state) => state.user;
