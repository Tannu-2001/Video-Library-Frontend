import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminLogin: React.FC = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
   
      const res = await api.post("/admins/login", { adminId, password });

      localStorage.setItem("adminToken", res.data.token);

    
      navigate("/admin-dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border">
        <h2 className="text-2xl font-bold text-center mb-6">🔐 Admin Login</h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin}>
          <table className="w-full">
            <tbody>
              {/* Admin ID Row */}
              <tr>
                <td className="py-2 pr-4 text-right font-medium">Admin ID:</td>
                <td className="py-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    placeholder="Enter your Admin ID"
                  />
                </td>
              </tr>

              {/* Password Row */}
              <tr>
                <td className="py-2 pr-4 text-right font-medium">Password:</td>
                <td className="py-2">
                  <input
                    type="password"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </td>
              </tr>

              {/* Button Row */}
              <tr>
                <td></td>
                <td className="py-4">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  >
                    Login
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;