import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Upload from "./pages/user/Upload";
import AllVideos from "./pages/AllVideos";
import Home from "./pages/Home";
import SingleVideo from "./pages/SingleVideo";
import UserVideos from "./pages/user/UserVideos";
import UpdateVideo from "./pages/user/UpdateVideo";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/video/:id", element: <SingleVideo /> },
  { path: "/sign-up", element: <ProtectedRoute element={<SignUp />} /> },
  { path: "/sign-in", element: <ProtectedRoute element={<SignIn />} /> },
  { path: "/all-videos", element: <AllVideos /> },
  { path: "/user/profile", element: <ProtectedRouteHome element={<UserProfile />} /> },
  { path: "/user/videos", element: <ProtectedRouteHome element={<UserVideos />} /> },
  { path: "/user/upload-video", element: <ProtectedRouteHome element={<Upload />} /> },
  { path: "/user/edit-video", element: <ProtectedRouteHome element={<UpdateVideo />} /> },
  { path: "/reset-password", element: <ProtectedRoute element={<ResetPasswordEmail />} /> },
  { path: "/reset-password/:token", element: <ProtectedRoute element={<UpdatePassword />} /> },
]);
