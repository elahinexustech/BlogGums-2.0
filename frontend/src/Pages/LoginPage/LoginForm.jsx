import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './login.css';
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../_CONSTS_';

const LoginForm = () => {
    const [passVisibility, setPassVisibility] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const username = watch('username');
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const r = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resp = await r.json();
            if (resp.access && resp.refresh) {
                localStorage.clear();
                localStorage.setItem(ACCESS_TOKEN, resp.access);
                localStorage.setItem(REFRESH_TOKEN, resp.refresh);
                location.reload();
            } else {
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
            <Helmet>
                <title>Login to BlogGums</title>
            </Helmet>
            <div className='container flex login-container'>
                <div className="obj form-container">
                    <h1>Login</h1>
                    <br />
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <form className='flex direction-col jc-start ai-start' onSubmit={handleSubmit(onSubmit)}>
                        <LabelField
                            id="username"
                            placeholder="username"
                            register={register}
                            requiredMessage="Username is required"
                            errors={errors}
                        />
                        <br />
                        <LabelPasswordField
                            id="password"
                            placeholder="password"
                            register={register}
                            requiredMessage="Password is required"
                            errors={errors}
                            passVisibility={passVisibility}
                            setPassVisibility={setPassVisibility}
                        />
                        <br />
                        <Link to={'/resetpassword'} className='caption grey flex'><i className="bi bi-repeat"></i>&nbsp; Reset Password</Link>
                        <br />
                        <button className='theme' type="submit" disabled={!username || !password || isSubmitting}>
                            <i className="bi bi-box-arrow-right"></i> &nbsp;Login
                        </button>
                        <br />
                        <p className='grey caption'>
                            Don't have an account, <Link className="colored" to="/signup">create one</Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginForm;