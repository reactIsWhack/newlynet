import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  renderModal: false,
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setRenderModal(state, action) {
      state.renderModal = action.payload;
    },
  },
});

export default popupSlice.reducer;

export const selectPopup = (state) => state.popup;

export const { setRenderModal } = popupSlice.actions;
