import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getNovelData = createAsyncThunk(
  'novel/getNovelData',
  async (url: string, { rejectWithValue }) => {
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
      if (novelStream.status !== 200) {
        throw new Error(novelData.error);
      }
      console.log(novelData);
      return await novelData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

interface NovelState {
  novelData: {
    serieName: string;
    serieImageSrc: string;
    authorName: string;
    authorLink: string;
    lastUpdate: string;
    synopsis: string;
    chapters: Array<{ title: string; link: string }>;
  };
  isLoading: boolean;
  hasError: boolean;
  error: string;
}

const initialState: NovelState = {
  novelData: {
    serieName: '',
    serieImageSrc: '',
    authorName: '',
    authorLink: '',
    lastUpdate: '',
    synopsis: '',
    chapters: [],
  },
  isLoading: false,
  hasError: false,
  error: '',
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
      console.log('payLoad', novelData);
      const isLoading = false;
      const error = null;
      return {
        ...state,
        novelData,
        error,
        isLoading,
      };
    });
    builder.addCase(getNovelData.rejected, (state, { payload }) => {
      const hasError = true;
      const isLoading = false;
      const error = payload.toString();
      console.log('error', error);
      return {
        ...state,
        error,
        hasError,
        isLoading,
      };
    });
  },
});

export default novelSlice.reducer;
