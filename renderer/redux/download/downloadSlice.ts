import { createSlice } from '@reduxjs/toolkit';

type BooleanOrNull = boolean | null;

const initialState = {
  downloadSuccess: null as BooleanOrNull,
};

const downloadSlice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setDownloadSuccess: (state, action) => {
      const downloadSuccess = action.payload;
      return {
        ...state,
        downloadSuccess,
      };
    },
  },
});

export const { setDownloadSuccess } = downloadSlice.actions;
export default downloadSlice.reducer;
