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

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register: otpRegister, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm();

    const username = watch('username');
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setEmail(data.email);
        try {
            const response = await fetch(`${SERVER}:${PORT}/api/user/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
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
            <div className="container flex signup-container">
                <div className="obj form-container">
                    {!otpSent ? (
                        <>
                            <h1>Signup</h1>
                            <br />
                            <form className="flex direction-col jc-start ai-start" onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid cols-2 gap-2">
                                    <LabelField id="username" placeholder="Username" register={register} requiredMessage="Username is required" errors={errors} />
                                    <LabelField id="email" type="email" placeholder="Email" register={register} requiredMessage="Email is required" errors={errors} />
                                    <LabelPasswordField id="password" placeholder="Password" register={register} requiredMessage="Password is required" errors={errors} />
                                    <LabelPasswordField id="confirm_password" placeholder="Confirm Password" register={register} requiredMessage="Password confirmation is required" errors={errors} />
                                    <LabelField id="f_name" placeholder="First Name" register={register} requiredMessage="First Name is required" errors={errors} />
                                    <LabelField id="l_name" placeholder="Last Name" register={register} requiredMessage="Last Name is required" errors={errors} />
                                </div>
                                <br /><br />
                                <button type="submit" disabled={!username || !password || isSubmitting} className="theme">
                                    <i className="bi bi-box-arrow-right"></i> &nbsp;Signup
                                </button>
                                <br />
                                <p className='grey caption'>
                                    Already a BlogGums user, <Link className="colored" to="/">login</Link>
                                </p>
                            </form>
                        </>
                    ) : !otpVerified ? (
                        <>
                            <h1>Email Verification</h1>
                            <form className="flex direction-col jc-start ai-start" onSubmit={handleOtpSubmit(onOtpSubmit)}>
                                <LabelField id="otp" placeholder="Enter OTP" register={otpRegister} requiredMessage="OTP is required" errors={otpErrors} />
                                {otpError && <p className="error">{otpError}</p>}
                                <button type="submit" className="theme">Verify OTP</button>
                            </form>
                        </>
                    ) : (
                        <div className='successful-registration flex direction-col'>
                            <i className="bi bi-check-circle-fill success"></i>
                            <h1 className='success'>Registration Successful!</h1>
                            <br /><br />
                            <p className="heading">Your account has been created, now login to your account. &nbsp;<Link to={'/login'} className='colored'><u>Click here</u></Link></p>
                        </div>
                    )}
                </div>
            </div>  
            <Footer />
        </>
    );
};

export default SignUpForm;
