import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = import.meta.env.VITE_SERVER_URL;

const initialState = {
  userId: '',
  contacts: [],
  fullName: '',
  profilePicture: '',
  grade: null,
  interests: [],
  school: null,
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
  async ({ id, filter }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/users/addcontact/${id}`
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
      console.log(action.payload);
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
        state.fullName = action.payload.fullName;
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
        state.fullName = action.payload.fullName;
        state.contacts = action.payload.contacts;
        state.profilePicture = action.payload.profilePicture;
        state.grade = action.payload.grade;
        state.school = action.payload.school;
        state.chattingWith = action.payload.chattingWith;
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
        state.fullName = action.payload.fullName;
        state.contacts = action.payload.contacts;
        state.profilePicture = action.payload.profilePicture;
        state.grade = action.payload.grade;
        state.school = action.payload.school;
        state.chattingWith = action.payload.chattingWith;
        state.unreadChats = action.payload.unreadChats;
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
      });
  },
});

export default userSlice.reducer;

export const { setIsLoggedIn, resetStudents, setCursor, setUnreadChats } =
  userSlice.actions;

export const selectUser = (state) => state.user;
