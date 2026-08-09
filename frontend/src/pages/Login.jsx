import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    token,
    setToken,
    backendUrl
  } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {

        // REGISTER
        const { data } = await axios.post(
          backendUrl + "/api/user/register",
          {
            name,
            email,
            password
          }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }

      } else {

        // LOGIN
        const { data } = await axios.post(
          backendUrl + "/api/user/login",
          {
            email,
            password
          }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gray-50">

      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >

        {/* Heading */}
        <div className="mb-7">

          <h1 className="text-2xl font-semibold text-gray-800">
            {state === "Sign Up"
              ? "Create Account"
              : "Welcome Back"}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Please{" "}
            {state === "Sign Up"
              ? "sign up"
              : "login"}{" "}
            to book an appointment
          </p>

        </div>


        {/* Name */}
        {state === "Sign Up" && (
          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#5f6FFF] focus:ring-2 focus:ring-[#5f6FFF]/20 transition"
            />

          </div>
        )}


        {/* Email */}
        <div className="mb-5">

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#5f6FFF] focus:ring-2 focus:ring-[#5f6FFF]/20 transition"
          />

        </div>


        {/* Password */}
        <div className="mb-6">

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#5f6FFF] focus:ring-2 focus:ring-[#5f6FFF]/20 transition"
          />

        </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#5f6FFF] hover:bg-[#4f5ee8] text-white font-medium py-3 rounded-lg transition duration-200 cursor-pointer"
        >
          {state === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>


        {/* Switch Login / Signup */}
        <div className="text-center mt-6">

          {state === "Sign Up" ? (

            <p className="text-sm text-gray-500">

              Already have an account?{" "}

              <span
                onClick={() =>
                  setState("Login")
                }
                className="text-[#5f6FFF] font-medium cursor-pointer hover:underline"
              >
                Login here
              </span>

            </p>

          ) : (

            <p className="text-sm text-gray-500">

              Don't have an account?{" "}

              <span
                onClick={() =>
                  setState("Sign Up")
                }
                className="text-[#5f6FFF] font-medium cursor-pointer hover:underline"
              >
                Create account
              </span>

            </p>

          )}

        </div>

      </form>

    </div>
  );
};

export default Login;