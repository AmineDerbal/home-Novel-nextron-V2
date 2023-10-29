import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  downloadModal: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleDownloadModal: (state, action) => {
      const downloadModal = action.payload;
      return {
        ...state,
        downloadModal,
      };
    },
  },
});

export const { toggleDownloadModal } = modalSlice.actions;
export default modalSlice.reducer;
