import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: '',
  contacts: [],
  fullName: '',
  profilePicture: '',
  grade: null,
  interests: [],
  school: null,
  isLoading: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      console.log(action.payload);
      state.isLoggedIn = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setIsLoggedIn } = userSlice.actions;

export const selectUser = (state) => state.user;
