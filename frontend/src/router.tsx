import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import UpdatePassword from "./pages/auth/UpdatePassword";

export const router = createBrowserRouter([
  { path: "/sign-up", element: <ProtectedRoute element={<SignUp />} /> },
  { path: "/sign-in", element: <ProtectedRoute element={<SignIn />} /> },
  { path: "/user/profile", element: <ProtectedRouteHome element={<UserProfile />} /> },
  { path: "/reset-password", element: <ProtectedRoute element={<ResetPasswordEmail />} /> },
  { path: "/reset-password/:token", element: <ProtectedRoute element={<UpdatePassword />} /> },
]);
