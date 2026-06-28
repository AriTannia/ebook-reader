import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as FileService from "../services/file.service";
import { setMessage } from "./message";
import axios from "axios";

export const uploadFile = createAsyncThunk(
  "file/uploadFile",
  async ({file, onProgress}, thunkAPI) => {
    try {

      // Get presigned URL
      const presignedResponse =
        await FileService.generatePresignedAvatarUrl(file.name);

      const { uploadUrl, filePath } =
        presignedResponse.data.data;

      // Upload on S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
            if(!progressEvent.total) return;
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (onProgress) {
              onProgress(progress);
            }
          },
      });

      return {
        filePath,
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while uploading the file.";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  file: null,
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.file = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    }
});

export default fileSlice.reducer;