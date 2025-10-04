import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 

const safeDecode = (token?: string) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

const UserLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email, password });
      console.log("login response:", res.data);

      if (localStorage.getItem("adminToken")) {
        localStorage.removeItem("adminToken");
        console.log("removed adminToken");
      }

      const token = res.data?.token || res.data?.accessToken;
      if (!token) {
        console.warn("No token in response");
        navigate("/user-login-error", { state: { message: "No token returned" } });
        return;
      }

      localStorage.setItem("userToken",res.data.token);
      console.log("saved userToken");

      localStorage.setItem("userName",res.data.user.name);


      const payload = safeDecode(token);
      console.log("decoded payload:", payload);

      const role = payload?.role ?? payload?.userRole ?? null;
      console.log("role =>", role);

      if (role === "user") {
        navigate("/user-dashboard");
      } else if(role==="admin"){
        navigate("/admin-dashboard");
      }
        else{
          navigate("/user-login-error",{state:{message:"Unknown role"}})
        }
  
    } catch (err: any) {
      console.error("login error:", err);
      navigate("/user-login-error", {
        state: { message: err?.response?.data?.message || "Login failed" },
      });
    }
  };
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    {/* Card */}
    <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border">
      <h2 className="text-2xl font-bold text-center mb-6">🔐 User Login</h2>

     

      <form onSubmit={handleLogin}>
        <table className="w-full">
          <tbody>
            {/* Email Row */}
            <tr>
              <td className="py-2 pr-4 text-right font-medium align-top">Email:</td>
              <td className="py-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
                />
              </td>
            </tr>

            {/* Password Row */}
            <tr>
              <td className="py-2 pr-4 text-right font-medium">Password:</td>
              <td className="py-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
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

export default UserLogin;