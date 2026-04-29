import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils/utils';

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('All fields are required');
    }

    try {
      const response = await axios.post(
        'https://user-auth-virid.vercel.app/api/v1/users/login',
        loginInfo,
        { withCredentials: true }
      );

      const { success, message } = response.data;

      if (success) {
        handleSuccess(message);

        setTimeout(() => {
          navigate('/welcome');
        }, 1000);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'need to SignUp';
      handleError(message);
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="min-h-[450px] w-full max-w-2xl bg-gray-100 shadow-2xl backdrop-blur-lg p-8 flex flex-col rounded-2xl">
          <h1 className="text-center font-bold text-5xl mb-9 text-amber-900 underline">
            Log In
          </h1>

          <form
            className="flex flex-col items-center gap-5"
            onSubmit={handleLogin}
          >
            <div className="flex gap-11 text-amber-900 items-center">
              <label className="font-bold text-2xl" htmlFor="email">
                Email:
              </label>
              <input
                className="border-2 rounded-xl p-2 font-bold border-black"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email..."
                autoFocus
                onChange={handleChange}
                value={loginInfo.email}
              />
            </div>

            <div className="flex gap-2 text-amber-900 items-center">
              <label className="font-bold text-2xl" htmlFor="password">
                Password:
              </label>
              <input
                className="border-2 rounded-xl p-2 font-bold border-black"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password..."
                onChange={handleChange}
                value={loginInfo.password}
              />
            </div>

            <button
              type="submit"
              className="bg-amber-100 text-amber-900 p-3 rounded-2xl w-52 mt-3 hover:bg-gray-600 hover:text-white font-bold text-2xl cursor-pointer shadow-lg"
            >
              Login
            </button>

            <span>
              Don't have an account?{' '}
              <Link className="text-blue-800 font-bold" to="/">
                Sign Up
              </Link>
            </span>
          </form>

          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default Login;
