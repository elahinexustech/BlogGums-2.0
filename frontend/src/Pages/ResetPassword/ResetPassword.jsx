import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import FormView from '../../components/FormView/FormView';
import './reset.css';
import { ACCESS_TOKEN, PORT, SERVER, USER_DATA } from '../../_CONSTS_';
import { Helmet } from 'react-helmet';

const ResetPasswordForm = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [STEP_TITLE, setStepTitle] = useState('Reset Password');
    const access_token = localStorage.getItem(ACCESS_TOKEN) || '';

    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const reset_email = watch('reset_email');
    const newPassword = watch('new_password');
    const confirmPassword = watch('confirm_password');

    useEffect(() => {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    const handleCodeInput = () => {
        const inputs = document.querySelectorAll('.otp-input');
        let code = '';
        inputs.forEach(input => {
            code += input.value;
        });
        return code;
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            if (step === 1) {
                const response = await fetch(`${SERVER}:${PORT}/api/sendcode`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email: data.reset_email }),
                });

                if (response.ok) {
                    setEmail(data.reset_email);
                    setStep(2);
                    setStepTitle('Enter 6-Digit Code');
                } else {
                    setErrorMessage('Failed to send reset code. Please try again.');
                }
            } else if (step === 2) {
                const code = handleCodeInput();
                const response = await fetch(`${SERVER}:${PORT}/api/verifycode`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email, code, type: 'PERMENANT' }),
                });

                if (response.ok) {
                    setResetCode(code);
                    setStep(3);
                    setStepTitle('New password');
                } else {
                    setErrorMessage('Invalid code. Please try again.');
                }
            } else if (step === 3) {
                if (newPassword !== confirmPassword) {
                    setErrorMessage("Passwords do not match.");
                    return;
                }

                const response = await fetch(`${SERVER}:${PORT}/api/reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ type: 'PERMENANT', email, code: resetCode, newPassword }),
                });

                if (response.ok) {
                    navigate('/login');
                } else {
                    setErrorMessage('Failed to reset password. Please try again.');
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldsStep1 = [
        {
            label: 'Email',
            type: 'email',
            id: 'reset_email',
            placeholder: 'Enter your email',
            requiredMessage: 'Email is required',
        }
    ];

    const fieldsStep2 = [
        {
            label: 'Enter Code',
            type: 'text',
            id: 'otp',
            placeholder: 'Enter OTP',
            requiredMessage: 'OTP is required',
        }
    ];

    const fieldsStep3 = [
        {
            label: 'New Password',
            type: 'password',
            id: 'new_password',
            placeholder: 'Enter new password',
            requiredMessage: 'New password is required',
        },
        {
            label: 'Confirm Password',
            type: 'password',
            id: 'confirm_password',
            placeholder: 'Confirm new password',
            requiredMessage: 'Confirm password is required',
        }
    ];

    const features = [
        { icon: 'bi bi-shield-lock', text: 'Secure your account.' },
        { icon: 'bi bi-envelope-check', text: 'Receive notifications.' },
        { icon: 'bi bi-person-check', text: 'Verify your identity.' }
    ];

    return (
        <>
            <Helmet>
                <title>Reset Password {isLoggedIn ? `for ${JSON.parse(localStorage.getItem(USER_DATA)).user.username}` : ''}</title>
            </Helmet>
            {step === 1 && (
                <FormView
                    type={'reset'}
                    title={'Reset Password'}
                    fields={fieldsStep1}
                    onSubmit={handleSubmit(onSubmit)}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    features={features}
                    register={register}
                    errors={errors}
                    linkMessage={<Link to="/login">Back to Login</Link>}
                />
            )}
            {step === 2 && (
                <FormView
                    type={'reset'}
                    title={'Enter 6-Digit Code'}
                    fields={fieldsStep2}
                    onSubmit={handleSubmit(onSubmit)}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    features={features}
                    register={register}
                    errors={errors}
                    linkMessage={null}
                />
            )}
            {step === 3 && (
                <FormView
                    type={'reset'}
                    title={'New Password'}
                    fields={fieldsStep3}
                    onSubmit={handleSubmit(onSubmit)}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    features={features}
                    register={register}
                    errors={errors}
                    linkMessage={null}
                />
            )}
            <Footer />
        </>
    );
};

export default ResetPasswordForm;