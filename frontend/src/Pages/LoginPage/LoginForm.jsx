import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

// CSS
import './login.css';

// Images
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';

// Components

const LoginForm = () => {
    const [passVisibility, setPassVisibility] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
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
        setErrorMessage(''); // Reset error message on new submission
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

            // Check if access and refresh tokens are present
            if (resp.access && resp.refresh) {
                localStorage.clear();
                localStorage.setItem("ACCESS_TOKEN", resp.access);
                localStorage.setItem("REFRESH_TOKEN", resp.refresh);
                location.reload();
            } else {
                // Set error message if tokens are not present
                setErrorMessage('Invalid credentials. Please try again.');
            }

        } catch (error) {
            console.error('Error during submission:', error);
            setErrorMessage('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='container flex login-container'>
                <div className="obj form-container">
                    <h1>Login</h1>
                    <br />
                    {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message */}
                    <form
                        className='flex direction-col jc-start ai-start'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <LabelField
                            id="username"
                            placeholder="username"
                            register={register}
                            requiredMessage="Username is required"
                            errors={errors}
                        />

                        <LabelPasswordField
                            id="password"
                            placeholder="password"
                            register={register}
                            requiredMessage="Password is required"
                            errors={errors}
                            passVisibility={passVisibility}
                            setPassVisibility={setPassVisibility}
                        />

                        <a className='caption grey flex'><i className="bi bi-repeat"></i>&nbsp; Reset Password</a>

                        <br />
                        <button
                            type="submit"
                            style={{ "--text-color": "#fff" }}
                            disabled={!username || !password || isSubmitting} // Disable if empty fields or submitting
                        >
                            <i className="bi bi-box-arrow-right"></i> &nbsp;Login
                        </button>
                    </form>
                    <p className='grey caption'>
                        Don't have an account, <Link className="colored" to="/signup">create one</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default LoginForm;