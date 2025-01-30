import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";

interface ResetResponse {
  success: boolean;
  message: string;
}

const ResetPasswordEmail: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { data } = await backendApi.post<ResetResponse>("/api/v1/auth/reset-password", {
        email,
      });
      if (data.success) {
        setLoading(false);
        toast.success(data.message);
        setEmail("");
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong");
      console.error(`Error in submit new password ${error}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">Reset your password</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-400">
                Email
              </label>
              <input type="email" name="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button
              className={`w-full px-4 py-2 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center ${loading} bg-opacity-90 hover:bg-opacity-90`}
              disabled={loading}
            >
              Reset Password
            </button>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600 pr-1">Not a member yet?</span>
              <Link to={"/sign-up"} className="text-blue-700 text-sm">
                Sign Up for free
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordEmail;
