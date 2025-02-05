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

// Get Public Videos
export const fetchPublicVideos = createAsyncThunk<IVideo[], void, { rejectValue: string }>("/videos/fetch-public-videos", async (_, thunkApi) => {
  try {
    const { data } = await backendApi.get<FilesResponse>("/api/v1/fetch-videos");

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

// Get Download Link
export const downloadVideo = createAsyncThunk<void, { id: string }, { rejectValue: string }>("/video/download", async (payload, thunkApi) => {
  try {
    const { id } = payload;
    const state = thunkApi.getState() as RootState;
    const queryParams = state.auth.loggedInUser ? `userId=${encodeURIComponent(state.auth.loggedInUser._id)}` : "";
    const response = await backendApi.get(`/api/v1/download/file/${id}${queryParams}`, { responseType: "blob" });
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition ? contentDisposition.split("filename=")[1].replace(/['"]/g, "") : "video.mp4";
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    return thunkApi.rejectWithValue(error);
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
export const selectLoadingVideos = (state: RootState) => state.video.isLoading;
