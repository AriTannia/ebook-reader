import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as FileService from "../services/file.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utils/errorHandler";
import axios from "axios";

export const FILE_UPLOAD_TYPE = {
  AVATAR: "avatar",
  BOOK: "book",
  BOOK_FORMAT: "book-format",
};

const presignedUrlGenerators = {
  [FILE_UPLOAD_TYPE.AVATAR]: FileService.generatePresignedAvatarUrl,
  [FILE_UPLOAD_TYPE.BOOK]: FileService.generatePresignedBookUrl,
  [FILE_UPLOAD_TYPE.BOOK_FORMAT]: FileService.generatePresignedBookFormatUrl,
};

export const uploadFile = createAsyncThunk(
  "file/uploadFile",
  async ({ file, type }, thunkAPI) => {
    try {

      // Get presigned URL
      const generator = presignedUrlGenerators[type];

      if (!generator) {
        throw new Error(`Unsupported upload type: ${type}`);
      }

      const presignedResponse = await generator(file.name);

      const { filename, url } =
        presignedResponse.data.data;

      // Upload on S3
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        }
      });

      return {
        filePath: filename,
      };

    } catch (error) {

      const message = getErrorMessage(error);

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