import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './signup.css';
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';
import { SERVER, PORT } from '../../_CONSTS_';

const SignUpForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [email, setEmail] = useState('');
    const [otpError, setOtpError] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
    const { register: otpRegister, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm();

    const username = watch('username');
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setEmail(data.email);
        if (data.password !== data.confirm_password) {
            setIsSubmitting(false);
            setError('confirm_password', { type: 'manual', message: 'Passwords do not match' });
            return;
        }
        try {
            const response = await fetch(`${SERVER}:${PORT}/api/user/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) setOtpSent(true);
            else console.error(await response.json());
        } catch (error) {
            console.error('Error during submission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const onOtpSubmit = async (data) => {
        try {
            const response = await fetch(`${SERVER}:${PORT}/api/verifycode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'TEMP', email, code: data.otp })
            });
            if (response.ok) setOtpVerified(true);
            else setOtpError((await response.json()).message || 'Invalid OTP');
        } catch (error) {
            console.error('Error during OTP verification:', error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Signup to BlogGums</title>
            </Helmet>
            <div className='container flex signup-container'>
                <div className="content-container flex">
                    <div className="left flex ai-start jc-start direction-col">
                        <p className="title">Signup</p>
                        <p className="subtitle">to BlogGums</p>
                        <br /><hr /><br />
                        <ul className='features-list'>
                            <p className="heading">Join BlogGums to:</p>
                            <li className='caption'><i className="bi bi-plus-circle"></i> &nbsp;Create your own blogs.</li>
                            <li className='caption'><i className="bi bi-person-hearts"></i> &nbsp;Interact with different users.</li>
                            <li className='caption'><i className="bi bi-balloon-heart-fill"></i> &nbsp;Blog Interactions <span className="heading">+</span> Sharing blogs.</li>
                            <li className='caption'><i className="bi bi-emoji-smile-upside-down-fill"></i> &nbsp;And many more...</li>
                        </ul>
                    </div>
                    <div className="form-container right flex direction-col">
                        <p className="title">SignUp</p>
                        {!otpSent ? (
                            <>
                                <br />
                                {otpError && <p className="error">{otpError}</p>}
                                <form className='flex direction-col jc-start ai-start' onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid cols-2 gap-2">
                                        <div>
                                            <p className="heading-2 grey">Username</p>
                                            <LabelField
                                                id="username"
                                                placeholder="Username"
                                                register={register}
                                                requiredMessage="Username is required"
                                                errors={errors}
                                            />
                                        </div>
                                        <div>
                                            <p className="heading-2 grey">Email</p>
                                            <LabelField
                                                id="email"
                                                type="email"
                                                placeholder="Email"
                                                register={register}
                                                requiredMessage="Email is required"
                                                errors={errors}
                                            />
                                        </div>
                                        <div>
                                            <p className="heading-2 grey">Password</p>
                                            <LabelPasswordField
                                                id="password"
                                                placeholder="Password"
                                                register={register}
                                                requiredMessage="Password is required"
                                                errors={errors}
                                            />
                                        </div>
                                        <div>
                                            <p className="heading-2 grey">Confirm Password</p>
                                            <LabelPasswordField
                                                id="confirm_password"
                                                placeholder="Confirm Password"
                                                register={register}
                                                requiredMessage="Password confirmation is required"
                                                errors={errors}
                                            />
                                        </div>
                                        <div>
                                            <p className="heading-2 grey">First Name</p>
                                            <LabelField
                                                id="first_name"
                                                placeholder="First Name"
                                                register={register}
                                                requiredMessage="First Name is required"
                                                errors={errors}
                                            />
                                        </div>
                                        <div>
                                            <p className="heading-2 grey">Last Name</p>
                                            <LabelField
                                                id="last_name"
                                                placeholder="Last Name"
                                                register={register}
                                                requiredMessage="Last Name is required"
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                    <br />
                                    <button className='theme' type="submit" disabled={!username || !password || isSubmitting}>
                                        <i className="bi bi-box-arrow-right"></i> &nbsp;Signup
                                    </button>
                                    <br />
                                    <p className='caption'>Already a BlogGums user, <Link className='colored' to="/">login</Link></p>
                                </form>
                            </>
                        ) : !otpVerified ? (
                            <>
                                <br />
                                {otpError && <p className="error">{otpError}</p>}
                                <form className='flex direction-col jc-start ai-start' onSubmit={handleOtpSubmit(onOtpSubmit)}>
                                    <p className="heading-2 grey">Enter OTP</p>
                                    <LabelField
                                        id="otp"
                                        placeholder="Enter OTP"
                                        register={otpRegister}
                                        requiredMessage="OTP is required"
                                        errors={otpErrors}
                                    />
                                    <br />
                                    <button className='theme' type="submit">
                                        <i className="bi bi-check-circle"></i> &nbsp;Verify OTP
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className='successful-registration flex direction-col'>
                                <i className="bi bi-check-circle-fill" style={{color: 'var(--success)', fontSize: '4rem'}}></i>
                                <h1 className='success'>Registration Successful!</h1>
                                <br /><br />
                                <p className="heading">Your account has been created, now login to your account. &nbsp;<Link to={'/login'} className='colored'><u>Click here</u></Link></p>
                            </div>
                     )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignUpForm;
