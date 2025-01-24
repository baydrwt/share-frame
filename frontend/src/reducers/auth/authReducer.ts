/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";

interface User {
  _id: string;
  email: string;
  name?: string;
  token: string;
  uploadContent: string;
  downloadContent: string;
}

export interface AuthState {
  loggedInUser: User | null;
  loading: boolean;
}

interface SignUpPayload {
  email: string;
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

const initialState: AuthState = {
  loggedInUser: null,
  loading: false,
};

export const SignUpUser = createAsyncThunk<void, SignUpPayload, { rejectValue: string }>("auth/sign-up-user", async (payload) => {
  try {
    const { data } = await backendApi.post<AuthResponse>("api/v1/auth/sign-up", payload);
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.warning(data.message);
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
});

export const SignInUser = createAsyncThunk<string | null, SignInPayload, { rejectValue: string }>("auth/sign-in-user", async (payload, thunkApi) => {
  try {
    const { email, password } = payload;
    const { data } = await backendApi.post("api/v1/auth/sign-in", { email, password });
    if (data.success) {
      if (data.user) {
        toast.success(data.message);
        localStorage.setItem("token", data.user.token);
      }
      return data.user.token || null;
      //TODO navigating user to the profile page
    } else {
      toast.warning(data.message);
      return thunkApi.rejectWithValue(data.message);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    toast.error(errorMessage);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SignInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(SignInUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(SignInUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
export const selectLoggedInUser = (state: RootState) => state.auth.loggedInUser;
export const selectLoading = (state: RootState) => state.auth.loading;
