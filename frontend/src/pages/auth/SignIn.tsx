import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormData } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../reducers/store";
import { selectLoading, SignInUser } from "../../reducers/auth/authReducer";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const loading = useSelector(selectLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    dispatch(SignInUser({ email, password, navigate }));
  };

  return (
    <Layout>
      <div className="flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>
          <form action="" className="space-y-7" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                placeholder="Enter your email address"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <Link to={"/reset-password"} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ">
              Forgot your password?
            </Link>
            <button type="submit" className="w-full py-3 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <p className="text-sm text-center mt-5">
            Don't have an acount?
            <Link to={"/sign-up"} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 pl-1">
              Sign Up for free
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
