import { createSlice } from '@reduxjs/toolkit';

interface DownloadState {
  downloadSuccess: boolean | null;
}

const initialState: DownloadState = {
  downloadSuccess: null,
};

const downloadSlice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setDownloadSuccess: (state, action) => {
      const { type } = action.payload;
      if (type === 'success') {
        const { downloadSuccess } = action.payload;
        return {
          ...state,
          downloadSuccess,
        };
      }
    },
  },
});

export const { setDownloadSuccess } = downloadSlice.actions;
export default downloadSlice.reducer;
