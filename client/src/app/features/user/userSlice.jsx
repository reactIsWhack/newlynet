import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = import.meta.env.VITE_SERVER_URL;

const initialState = {
  userId: '',
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
  cursor: '',
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
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
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
} = userSlice.actions;

export const selectUser = (state) => state.user;
