import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { AuthFormData } from "../../types";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`${formData.email}, ${formData.password} from sign-in page`);
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
            <Link to={"/"} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ">
              Forgot your password?
            </Link>
            <button type="submit" className="w-full py-3 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center">
              Sign In
            </button>
          </form>
          <p className="text-sm text-center mt-5">
            Don't have an acoount?
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
