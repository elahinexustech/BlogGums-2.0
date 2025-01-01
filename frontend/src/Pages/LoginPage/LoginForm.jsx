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
                <div className="content-container flex">
                    <div className="left flex ai-start jc-start direction-col">
                        <p className="title">Login</p>
                        <p className="subtitle">to BlogGums</p>
                        <br /><hr /><br />
                        <ul className='features-list'>
                            <p className="heading">What offers in login</p>
                            <li className='caption'><i className="bi bi-plus-circle"></i> &nbsp;Create your own blogs.</li>
                            <li className='caption'><i className="bi bi-person-hearts"></i> &nbsp;Interact with different users.</li>
                            <li className='caption'><i className="bi bi-balloon-heart-fill"></i> &nbsp;Blog Interactions <span className="heading">+</span> Sharing blogs.</li>
                            <li className='caption'><i className="bi bi-emoji-smile-upside-down-fill"></i> &nbsp;And many more...</li>
                        </ul>
                    </div>
                    <div className="form-container right flex direction-col">
                        <p className="title">Login</p>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <form className='flex direction-col jc-start ai-start' onSubmit={handleSubmit(onSubmit)}>
                            <>
                                <p className="heading-2 grey">Username</p>
                                <LabelField
                                    id="username"
                                    placeholder="username"
                                    register={register}
                                    requiredMessage="Username is required"
                                    errors={errors}
                                />
                            </>
                            <br />
                            <>
                                <p className="heading-2 grey">Pass***d</p>
                                <LabelPasswordField
                                    id="password"
                                    placeholder="password"
                                    register={register}
                                    requiredMessage="Password is required"
                                    errors={errors}
                                    passVisibility={passVisibility}
                                    setPassVisibility={setPassVisibility}
                                />
                            </>
                            <br />
                            <Link to={'/resetpassword'} className='caption grey flex'><i className="bi bi-repeat"></i>&nbsp; Reset Password</Link>
                            <br />
                            <button className='theme' type="submit" disabled={!username || !password || isSubmitting}>
                                <i className="bi bi-box-arrow-right"></i> &nbsp;Login
                            </button>
                            <br />
                            <p className='caption'>Don't have an account, <Link className='colored' to="/signup">create one</Link></p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginForm;