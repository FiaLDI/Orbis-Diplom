// store/uploadSlice.ts
import { config } from "@/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface UploadResponse {
  uploaded: string[];
}

export interface UploadFileState {
  name: string;
  progress: number;
  url?: string;
  error?: string;
}

export interface UploadState {
  files: UploadFileState[];
  overallProgress: number;
  loading: boolean;
  error?: string;
}

const initialState: UploadState = {
  files: [],
  overallProgress: 0,
  loading: false,
};

export const uploadFiles = createAsyncThunk<
  string[],
  File[],
  { rejectValue: string }
>("upload/files", async (files, { rejectWithValue, dispatch }) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const baseUrl = config.cdnServiceUrl || "http://localhost:4005";
    const res = await axios.post<UploadResponse>(`${baseUrl}/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / (progressEvent.total ?? 1)) * 100,
        );
        dispatch(setProgress(progress));
      },
    });

    return res.data.uploaded;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    resetUpload: (state) => {
      state.files = [];
      state.overallProgress = 0;
      state.error = undefined;
      state.loading = false;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.overallProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state, action) => {
        state.loading = true;
        state.error = undefined;
        state.files = [];
        state.overallProgress = 0;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.map((url) => ({
          name: url.split("/").pop() || "file",
          progress: 100,
          url,
        }));
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpload, setProgress } = uploadSlice.actions;
export default uploadSlice.reducer;
