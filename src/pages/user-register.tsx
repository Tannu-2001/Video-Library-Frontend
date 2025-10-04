import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UserRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/users/register", {
        name,
        email,
        mobile,
        password,
      });

      alert("✅ User registered successfully!");
      console.log("Registered User:", res.data);

      navigate("/user-login"); 
    } catch (err: any) {
      console.error("Register failed:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border">
        <h2 className="text-2xl font-bold text-center mb-6">📝 User Register</h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleRegister}>
          <table className="w-full">
            <tbody>
              {/* Name */}
              <tr>
                <td className="py-2 pr-4 text-right font-medium">Name:</td>
                <td className="py-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </td>
              </tr>

              {/* Email */}
              <tr>
                <td className="py-2 pr-4 text-right font-medium">Email:</td>
                <td className="py-2">
                  <input
                    type="email"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </td>
              </tr>

              {/* Mobile */}
              <tr>
                <td className="py-2 pr-4 text-right font-medium">Mobile:</td>
                <td className="py-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-black"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    placeholder="Enter your mobile number"
                  />
                </td>
              </tr>

              {/* Password */}
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

              {/* Register Button */}
              <tr>
                <td></td>
                <td className="py-4">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  >
                    Register
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        {/* Already account? Login */}
        <p className="mt-4 text-center text-primary text-decoration-underline px-2">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/user-login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;