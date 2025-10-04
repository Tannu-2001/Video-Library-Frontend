import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  message?: string;
}

const UserLoginError: React.FC<Props> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Login Failed</h2>

        <p className="text-gray-700 mb-6">
          {message || "Invalid credentials. Please try again."}
        </p>

        <button
          onClick={() => navigate("/user-login")}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          🔑 Back to Login
        </button>
      </div>
    </div>
  );
};

export default UserLoginError;