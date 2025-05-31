import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, LoaderCircle, Lock, Mail, MessageSquare, ScanFace, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {login, isLoggingIn} = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }

  return (
    <div className='h-screen grid lg:grid-cols-2 '>
      {/* Left Side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo Part */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <ScanFace className='size-8 text-secondary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className='text-base-content/60'> Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>

            {/* Mail Part */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>
                Email Address
                </span>
              </label>
              <div className='relative'>
                <div className='absolute z-1 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-primary' />
                </div>
                <input
                  type='email'
                  className={'input input-bordered w-full  text-center'}
                  placeholder='@email.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Part */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>
                  Password
                </span>
              </label>
              <div className='relative'>
                <div className='absolute z-1 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-primary' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={'input input-bordered w-full text-center'}
                  placeholder='********'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40' />
                  ) : (
                    <Eye className='size-5 text-base-content/40' />
                  )}

                </button>
              </div>
            </div>

            {/* SignUp Button */}
            <button 
            type='submit'
            className='btn btn-primary w-full'
            disabled = {isLoggingIn}
            >
            { isLoggingIn ?(

              <>
              <LoaderCircle className='size-5 animate-spin' />
              Loading...
              </>
              ) : (
                "Sign in"
              )
            }

            </button>
          </form>

          {/* route to login */}
          <div className='text-center'>
            <p className='text-base-content/60'>
              Don't have an account?{" "}
              <Link to="/signup" className='link link-primary'>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
          {/* Right side */}
          <AuthImagePattern
            title = "Join our community"
            subtitle = "Connect with your friends and stay in touch with your loved ones."
          />
    </div>
  )
}

export default Login;