import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils/utils.js'
import axios from 'axios'

const Signup = () => {

  const [signupInfo, setSignupInfo] = useState({
    username: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    const copySignupInfo = { ...signupInfo }
    copySignupInfo[name] = value
    setSignupInfo(copySignupInfo)
  }


  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password } = signupInfo;
    if (!username || !email || !password) {
      return handleError("All fields required")
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", signupInfo)
      console.log(response.data)
      const { success, message, error } = response.data
      if (success) {
        handleSuccess(message)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }

    } catch (error) {
      const message = error.response?.data?.message || "User already existed";
      handleError(message)

    }
  }

  return (
    <>
      <div className='h-screen flex justify-center items-center'>
        <div className='min-h-70 min-w-2xl bg-gray-100 shadow-2xl backdrop-blur-lg p-5 flex flex-col rounded-2xl'>
          <h1 className='text-center font-bold text-5xl mb-9 text-amber-900 underline'>Sign Up</h1>
          <form
            className='min-w-60 min-h-45 flex flex-col items-center p-3 gap-3'
            onSubmit={handleSignup}
          >
            <div className='flex gap-10 text-amber-900 items-center'>
              <label className='font-bold text-2xl ml-0' htmlFor='name'>Name:</label>
              <input
                className='border-2 rounded-xl p-2 font-bold border-black'
                type='text'
                placeholder='Enter your name...'
                autoFocus
                name='username'
                onChange={handleChange}
                value={signupInfo.username}
              />
            </div>

            <div className='flex gap-11 text-amber-900 items-center'>
              <label className='font-bold text-2xl ' htmlFor='email'>Email:</label>
              <input
                className='border-2 rounded-xl p-2 font-bold border-black'
                type='email'
                placeholder='Enter your email...'
                autoFocus
                name='email'
                onChange={handleChange}
                value={signupInfo.email}
              />
            </div>

            <div className='flex gap-2 text-amber-900 items-center'>
              <label className='font-bold text-2xl ' htmlFor='password'>Password:</label>
              <input
                className='border-2 rounded-xl p-2 font-bold border-black'
                type='password'
                placeholder='Enter your password...'
                autoFocus
                name='password'
                onChange={handleChange}
                value={signupInfo.password}
              />
            </div>
            <button className='bg-amber-100 border-2 border-black shadow-blue-200 text-amber-900 p-3 rounded-2xl w-50 mt-3 border-0 hover:bg-gray-600 hover:cursor-pointer hover:text-white font-bold text-2xl'>Sign Up</button>
            <span>already have an account ? <Link className='text-blue-800 font-bold' to='/login'>login</Link></span>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  )
}

export default Signup