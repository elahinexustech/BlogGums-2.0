import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationsContext } from '../../components/Notifications/Notifications';
import { Helmet } from 'react-helmet';
import './signup.css';
import Footer from '../../components/Footer/Footer';
import FormView from '../../components/FormView/FormView';

// Import environment variables
import {
    SERVER,
    PORT
} from '../../_CONSTS_.js';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';


const SignUpForm = () => {
    const { addNotification, removeNotification } = useContext(NotificationsContext)
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
            const response = await fetch(`${BASE_URL}/api/user/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) setOtpSent(true);
            else console.error(await response.json());
        } catch (error) {
            addNotification(error, 'error')
        } finally {
            setIsSubmitting(false);
        }
    };

    const onOtpSubmit = async (data) => {
        try {
            const response = await fetch(`${BASE_URL}/api/verifycode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'TEMP', email, code: data.otp })
            });
            if (response.ok) {
                setOtpVerified(true);
                addNotification('You are successfully registered!', 'success');
            }
            else {
                setOtpError((await response.json()).message || 'Invalid OTP');
                addNotification('OPT Validation Error', 'error');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            addNotification('An error occured', 'error');
        }
    };

    const fields = [
        {
            label: 'Username',
            type: 'text',
            id: 'username',
            placeholder: 'Enter your username',
            requiredMessage: 'Username is required',
        },
        {
            label: 'Email',
            type: 'email',
            id: 'email',
            placeholder: 'Enter your email',
            requiredMessage: 'Email is required',
        },
        {
            label: 'Password',
            type: 'password',
            id: 'password',
            placeholder: 'Enter your password',
            requiredMessage: 'Password is required',
        },
        {
            label: 'Confirm Password',
            type: 'password',
            id: 'confirm_password',
            placeholder: 'Confirm your password',
            requiredMessage: 'Password confirmation is required',
        },
        {
            label: 'First Name',
            type: 'text',
            id: 'first_name',
            placeholder: 'Enter your first name',
            requiredMessage: 'First Name is required',
        },
        {
            label: 'Last Name',
            type: 'text',
            id: 'last_name',
            placeholder: 'Enter your last name',
            requiredMessage: 'Last Name is required',
        }
    ];

    const features = [
        { icon: 'bi bi-book', text: 'Access your saved articles' },
        { icon: 'bi bi-pencil-square', text: 'Write and publish your own articles' },
        { icon: 'bi bi-chat-dots', text: 'Interact with other users' }
    ];

    return (
        <>
            <Helmet>
                <title>Signup to BlogGums</title>
            </Helmet>
            {!otpSent ? (
                <FormView
                    type={'signup'}
                    title={'Signup'}
                    subtitle={'to BlogGums'}
                    features={features}
                    step={1}
                    fields={fields}
                    errorMessage={otpError}
                    onSubmit={handleSubmit(onSubmit)}
                    buttonText={'Signup'}
                    linkMessage={{ msg: 'Already a BlogGums user?', link: '/login', linkText: 'Login' }}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                />
            ) : !otpVerified ? (
                <FormView
                    type={'otp'}
                    title={'Verify OTP'}
                    subtitle={'Enter the OTP sent to your email'}
                    features={[]}
                    step={2}
                    fields={[
                        {
                            label: 'OTP',
                            type: 'text',
                            id: 'otp',
                            placeholder: 'Enter OTP',
                            requiredMessage: 'OTP is required',
                        }
                    ]}
                    errorMessage={otpError}
                    onSubmit={handleOtpSubmit(onOtpSubmit)}
                    buttonText={'Verify OTP'}
                    linkMessage={{ msg: 'Resend OTP', link: '#', linkText: 'Resend OTP' }}
                    register={otpRegister}
                    errors={otpErrors}
                    disabled={isSubmitting}
                />
            ) : (
                <div className='successful-registration flex direction-col'>
                    <i className="bi bi-check-circle-fill" style={{ color: 'var(--success)', fontSize: '4rem' }}></i>
                    <h1 className='success'>Registration Successful!</h1>
                    <br /><br />
                    <p className="heading">Your account has been created, now login to your account. &nbsp;<Link to={'/login'} className='colored'><u>Click here</u></Link></p>
                </div>
            )}
            <Footer />
        </>
    );
};

export default SignUpForm;
