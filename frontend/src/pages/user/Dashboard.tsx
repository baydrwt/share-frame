import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, selectLoggedInUser } from "../../reducers/auth/authReducer";
import SideBar from "../../components/SideBar";
import { FaEnvelope, FaUser, FaUserTag } from "react-icons/fa";
import { AppDispatch } from "../../reducers/store";

const Dashboard: React.FC = () => {
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserDetails());
    }
  }, []);
  return (
    <div className="flex gap-2 pr-2 h-full m-2">
      <SideBar />
      <main className="flex-1 p-4 mt-7 bg-white shadow-lg rounded-lg ml-1 lg:ml-64">
        <h1 className="text-center font-semibold text-xl text-gray-700 mb-5">Dashboard</h1>
        <div className="container flex flex-col gap-6">
          <div className="bg-gray-200 p-6 rounded-lg shadow-md mb-10">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FaUser className="h-6 w-6 text-blue-600" />
                </div>
                <div className="">
                  <h3 className="text-lg font-semibold mb-1">Name</h3>
                  <p className="text-gray-700 capitalize">{loggedInUser?.name}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <FaEnvelope className="h-6 w-6 text-green-500" />
                </div>
                <div className="">
                  <h3 className="text-lg font-semibold mb-1">Name</h3>
                  <p className="text-gray-700">{loggedInUser?.email}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <FaUserTag className="h-6 w-6 text-red-600" />
                </div>
                <div className="">
                  <h3 className="text-lg font-semibold mb-1">Role</h3>
                  <p className="text-gray-700 capitalize">User</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 justify-around items-center">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md w-full lg:w1/2">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Uploaded Video</h2>
              <p className="text-2xl font-bold text-gray-600">{loggedInUser?.uploadCount}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md w-full lg:w1/2">
              <h2 className="text-lg font-semibold text-green-600 mb-2">Download Count</h2>
              <p className="text-2xl font-bold text-gray-600">{loggedInUser?.downloadCount}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
