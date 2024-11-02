import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const EnhancedLoginForm = () => {
  const [passVisibility, setPassVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const username = watch('username');
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const r = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });

      let resp = await r.json();
      localStorage.clear();
      localStorage.setItem("ACCESS_TOKEN", resp.access);
      localStorage.setItem("REFRESH_TOKEN", resp.refresh);
      location.reload();
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Login Form Container */}
        <div 
          className={`w-1/2 transform transition-all duration-500 ease-out ${
            isHovered ? 'scale-105 -translate-y-2' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 transform perspective-1000">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Login
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  {...register('username', { required: "Username is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">{errors.username.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { required: "Password is required" })}
                    type={passVisibility ? 'text' : 'password'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setPassVisibility(!passVisibility)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                  >
                    {passVisibility ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link to="/reset-password" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                  Reset Password
                </Link>
              </div>

              <button
                type="submit"
                disabled={!username || !password || isSubmitting}
                className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium 
                  transform transition-all duration-200 hover:scale-105 hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Logo Typography Container */}
        <div className="w-1/2 flex justify-center items-center">
          <div 
            className={`transform transition-all duration-500 ${
              isHovered ? 'scale-95 translate-x-4' : ''
            }`}
          >
            <div className="text-center">
              <h1 className="text-8xl font-black text-white mb-4 tracking-tighter transform hover:scale-105 transition-transform duration-300 cursor-default">
                BLOG
              </h1>
              <p className="text-xl text-white/80 font-light tracking-wide">
                Bloggums by ****
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginForm;