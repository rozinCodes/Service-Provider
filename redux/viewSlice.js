import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showLoadingSpinner: true,
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setShowLoadingSpinner(state, { payload }) {
      state.showLoadingSpinner = !state.showLoadingSpinner;
    },
    resetView(state, action) {
      return initialState;
    },
  },
});

export const { setShowLoadingSpinner, resetView } = viewSlice.actions;
export default viewSlice.reducer;