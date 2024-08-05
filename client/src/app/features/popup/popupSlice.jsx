import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  renderModal: { render: false, name: '' },
  viewingUserData: null,
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setRenderModal(state, action) {
      state.renderModal = action.payload;
    },
    setViewingUserData(state, action) {
      state.viewingUserData = action.payload;
    },
  },
});

export default popupSlice.reducer;

export const selectPopup = (state) => state.popup;

export const { setRenderModal, setViewingUserData } = popupSlice.actions;
