// store/uploadSlice.ts
import { config } from '@/config';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UploadResponse, UploadState } from './types';

export const uploadFiles = createAsyncThunk<string[], File[], { rejectValue: string }>(
  'upload/files',
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const res = await axios.post<UploadResponse>(`${config.cdnServiceUrl}/upload` ||'http://26.234.138.233:3006/upload', formData);
      return res.data.uploaded;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState: UploadState = {
  loading: false,
  urls: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(uploadFiles.pending, state => {
        state.loading = true;
        state.error = undefined;
        state.urls = [];
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default uploadSlice.reducer;