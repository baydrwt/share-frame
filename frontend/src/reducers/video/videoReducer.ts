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

// Get User Videos
export const fetchUserVideos = createAsyncThunk<IVideo[], FileFetchPayload, { rejectValue: string }>("/videos/user", async (payload, thunkApi) => {
  try {
    const { configWithJwt } = payload;
    const { data } = await backendApi.get<FilesResponse>("/api/v1/aws/fetch-videos", configWithJwt);
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

// Delete the Video
export const deleteVideo = createAsyncThunk<{ id: string }, { id: string; configWithJWT: ConfigWithJWT }, { rejectValue: string }>("/video/delete", async (payload, thunkApi) => {
  try {
    const { id, configWithJWT } = payload;
    const { data } = await backendApi.delete<FilesResponse>(`/api/v1/aws/delete-single/${id}`, configWithJWT);
    if (data.success) {
      return { id };
    }
    return thunkApi.rejectWithValue(data.message);
  } catch (error: any) {
    return thunkApi.rejectWithValue(error);
  }
});

// Update the Video
export const updateVideo = createAsyncThunk<IVideo, { id: string; updateData: Partial<EditVideo>; configWithJWT: ConfigWithJWT }, { rejectValue: string }>("/video/delete", async (payload, thunkApi) => {
  try {
    const { id, updateData, configWithJWT } = payload;
    const formData = new FormData();
    if (updateData.path instanceof File) {
      formData.append("video", updateData.path);
    }
    if (updateData.thumbnail instanceof File) {
      formData.append("thumbnail", updateData.thumbnail);
    }
    if (updateData.title) formData.append("title", updateData.title);
    if (updateData.description) formData.append("description", updateData.description);
    formData.append("isPrivate", String(updateData.isPrivate));
    const { data } = await backendApi.put<SingleFileResponse>(`/api/v1/aws/update-video/${id}`, formData, {
      ...configWithJWT,
      headers: {
        ...configWithJWT.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.success && data.video) {
      toast.success("Success updated the video");
    }
    return thunkApi.rejectWithValue(data.message);
  } catch (error: any) {
    return thunkApi.rejectWithValue(error);
  }
});

// Search The Videos
export const searchVideos = createAsyncThunk<IVideo[], string, { rejectValue: string; state: RootState }>("/video/search", async (query, thunkApi) => {
  try {
    const { publicVideos, videos } = thunkApi.getState().video;
    const combinedVideos = [...(publicVideos || []), ...(videos || [])];
    const filterVideos = combinedVideos.filter((video) => video.title?.toLowerCase().includes(query.toLowerCase()) || video.description?.toLowerCase().includes(query.toLowerCase()));
    return filterVideos;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error);
  }
});

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setEditVideo: (state, action) => {
      state.editVideo = action.payload;
    },
  },
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
      })
      .addCase(fetchUserVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserVideos.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos?.filter((video) => video._id !== action.payload.id) || null;
        state.isLoading = false;
      })
      .addCase(deleteVideo.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.searchResult = action.payload;
      });
  },
});

export const videoReducer = videoSlice.reducer;
export const { setEditVideo } = videoSlice.actions;
export const selectPublicVideos = (state: RootState) => state.video.publicVideos;
export const selectUserVideos = (state: RootState) => state.video.videos;
export const selectLoadingVideos = (state: RootState) => state.video.isLoading;
export const selectEditingVideo = (state: RootState) => state.video.editVideo;
export const selectSearchVideos = (state: RootState) => state.video.searchResult;
