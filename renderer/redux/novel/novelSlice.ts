import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getNovelData = createAsyncThunk('novel/getNovelData', async (url) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
    }),
  };

  try {
    const novelStream = await fetch('/api/novel', options);
    const novelData = await novelStream.json();
    return await novelData;
  } catch (error) {
    return {
      status: 'Error',
      message: error,
    };
  }
});

const initialState = {
  novelData: {},
  isLoading: false,
  hasError: false,
};

const novelSlice = createSlice({
  name: 'novel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNovelData.pending, (state) => {
      const isLoading = true;
      return {
        ...state,
        isLoading,
      };
    });
    builder.addCase(getNovelData.fulfilled, (state, action) => {
      const novelData = action.payload;
      const isLoading = false;
      return {
        ...state,
        novelData,
        isLoading,
      };
    });
    builder.addCase(getNovelData.rejected, (state) => {
      const hasError = true;
      const isLoading = false;
      return {
        ...state,
        hasError,
        isLoading,
      };
    });
  },
});

export default novelSlice.reducer;
