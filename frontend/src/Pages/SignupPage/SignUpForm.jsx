import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// CSS
import './signup.css';

// Components
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';

const SignUpForm = () => {
  const [passVisibility, setPassVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the input fields
  const username = watch('username');
  const password = watch('password');

  // Function to handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      const r = await fetch('http://127.0.0.1:8000/api/user/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.f_name,
          last_name: data.l_name,
        }),
      });

      let resp = await r.json();

      const get_login = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      let stat = await get_login.json();

      localStorage.clear();
      localStorage.setItem('ACCESS_TOKEN', stat.access);
      localStorage.setItem('REFRESH_TOKEN', stat.refresh);
      location.reload();
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex items-center justify-between">
          {/* Signup Form Container */}
          <div className="w-1/2">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <div className="flex items-center justify-center mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Signup
                </h1>
              </div>

              <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-2 gap-2">
                  <LabelField
                    id="username"
                    placeholder="Username"
                    register={register}
                    requiredMessage="Username is required"
                    errors={errors}
                  />
                  <LabelField
                    id="email"
                    type="email"
                    placeholder="Email"
                    register={register}
                    requiredMessage="Email is required"
                    errors={errors}
                  />
                  <LabelPasswordField
                    id="password"
                    placeholder="Password"
                    register={register}
                    requiredMessage="Password is required"
                    errors={errors}
                    passVisibility={passVisibility}
                    setPassVisibility={setPassVisibility}
                  />
                  <LabelPasswordField
                    id="confirm_password"
                    placeholder="Confirm Password"
                    register={register}
                    requiredMessage="Password confirmation is required"
                    errors={errors}
                    passVisibility={passVisibility}
                    setPassVisibility={setPassVisibility}
                  />
                  <LabelField
                    id="f_name"
                    placeholder="First Name"
                    register={register}
                    requiredMessage="First Name is required"
                    errors={errors}
                  />
                  <LabelField
                    id="l_name"
                    placeholder="Last Name"
                    register={register}
                    requiredMessage="Last Name is required"
                    errors={errors}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium
                    transform transition-all duration-200 hover:scale-105 hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={!username || !password || isSubmitting}
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link className="text-purple-600 hover:text-purple-800 font-medium" to="/">
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Logo Typography Container */}
          <div className="w-1/2 flex justify-center items-center">
            <div>
              <div className="text-center">
                <h1 className="text-8xl font-black text-white mb-4 tracking-tighter transform hover:scale-105 transition-transform duration-300 cursor-default">
                  BLOG
                </h1>
                <p className="text-xl text-white/80 font-light tracking-wide">
                signIn to Discover!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUpForm;
