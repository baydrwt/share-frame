import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ConfigWithJWT } from "../../types";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";
import { RootState } from "../store";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IVideo {
  _id: string;
  path: string;
  title?: string;
  description: string;
  uploadedBy: {
    email: string;
  };
  isPrivate: boolean | string;
  thumbnail: string;
}

export interface EditVideo {
  _id: string;
  path: File | string;
  title?: string;
  description: string;
  uploadedBy: {
    email: string;
  };
  isPrivate: boolean | string;
  thumbnail: File | string;
}

export interface VideoState {
  videos: IVideo[] | null;
  publicVideos: IVideo[] | null;
  searchResult: IVideo[] | null;
  isLoading: boolean;
  editVideo: IVideo | null;
}

interface FileFetchPayload {
  configWithJwt: ConfigWithJWT;
}

interface SingleFileResponse {
  success: boolean;
  message: string;
  video?: IVideo;
}

interface FilesResponse {
  success: boolean;
  message: string;
  videos?: IVideo[];
}

const initialState: VideoState = {
  videos: [],
  publicVideos: [],
  searchResult: [],
  isLoading: false,
  editVideo: null,
};

export const fetchPublicVideos = createAsyncThunk<IVideo[], void, { rejectValue: string }>("/videos/fetch-public-videos", async (_, thunkApi) => {
  try {
    const { data } = await backendApi.get<FilesResponse>("/api/v1/aws/fetch-videos");

    if (data.success) {
      return data.videos || [];
    }

    return thunkApi.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    toast.error(errMessage);
    return thunkApi.rejectWithValue(errMessage);
  }
});

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicVideos.fulfilled, (state, action) => {
        state.publicVideos = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPublicVideos.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const videoReducer = videoSlice.reducer;
export const selectPublicVideos = (state: RootState) => state.video.publicVideos;
