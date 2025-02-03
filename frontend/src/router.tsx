import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Upload from "./pages/user/Upload";

export const router = createBrowserRouter([
  { path: "/sign-up", element: <ProtectedRoute element={<SignUp />} /> },
  { path: "/sign-in", element: <ProtectedRoute element={<SignIn />} /> },
  { path: "/user/profile", element: <ProtectedRouteHome element={<UserProfile />} /> },
  { path: "/user/upload-video", element: <ProtectedRouteHome element={<Upload />} /> },
  { path: "/reset-password", element: <ProtectedRoute element={<ResetPasswordEmail />} /> },
  { path: "/reset-password/:token", element: <ProtectedRoute element={<UpdatePassword />} /> },
]);
