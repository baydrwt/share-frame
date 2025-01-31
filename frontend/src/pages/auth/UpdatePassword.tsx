import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";
import Layout from "../../components/Layout";

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const UpdatePassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await backendApi.put<ResetPasswordResponse>(`/api/v1/auth/update-password/${token}`, { password });
      if (data.success) {
        toast.success(data.message);
        navigate("/sign-in");
      } else {
        toast.warning(data.message);
        navigate("/sign-up");
      }
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-400">
                New Password
              </label>
              <input type="password" name="password" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button
              className={`w-full px-4 py-2 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center ${loading} bg-opacity-90 hover:bg-opacity-90`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Reset Password"
              )}
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

export default UpdatePassword;
