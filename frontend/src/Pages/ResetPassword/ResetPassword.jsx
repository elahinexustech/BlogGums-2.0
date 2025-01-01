import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';
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

    return (
        <>
            <Helmet>
                <title>Reset Password {isLoggedIn ? `for ${JSON.parse(localStorage.getItem(USER_DATA)).user.username}` : ''}</title>
            </Helmet>
            <div className='container flex reset-container'>
                <div className="content-container flex">
                    <div className="left flex ai-start jc-start direction-col">
                        <Link to={'/'} className='flex goBackLink' style={{color: 'white'}}><i className='bi bi-arrow-left-circle' style={{color: 'inherit'}}></i>&nbsp;Go Back</Link>
                        <p className="title">Reset Password</p>
                        <p className="subtitle">for your Account</p>
                        <br /><hr /><br />
                        <ul className='features-list'>
                            <p className="heading">Reset your password to:</p>
                            <li className='caption'><i className="bi bi-shield-lock"></i> &nbsp;Secure your account.</li>
                            <li className='caption'><i className="bi bi-envelope-check"></i> &nbsp;Receive notifications.</li>
                            <li className='caption'><i className="bi bi-person-check"></i> &nbsp;Verify your identity.</li>
                        </ul>
                    </div>
                    <div className="form-container right flex direction-col">
                        <p className="title">{STEP_TITLE}</p>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <form className='flex direction-col jc-start ai-start' onSubmit={handleSubmit(onSubmit)}>
                            {step === 1 && (
                                <>
                                    <p className="heading-2 grey">Email</p>
                                    <LabelField
                                        id="reset_email"
                                        placeholder="Enter your email"
                                        register={register}
                                        requiredMessage="Email is required"
                                        errors={errors}
                                    />
                                    <br />
                                    <button className='theme' type="submit" disabled={!reset_email || isSubmitting}>
                                        <i className="bi bi-box-arrow-right"></i> &nbsp;Send Code
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <p className="heading-2 grey">Enter Code</p>
                                    <div className="otp-boxes-container flex direction-row">
                                        {[...Array(6)].map((_, i) => (
                                            <React.Fragment key={i}>
                                                <input
                                                    type="text"
                                                    className="otp-input obj-trans"
                                                    maxLength="1"
                                                    id={`num${i + 1}`}
                                                    onInput={(e) => {
                                                        if (e.target.value.length === 1 && e.target.nextElementSibling) {
                                                            e.target.nextElementSibling.focus();
                                                        }
                                                    }}
                                                />
                                                {i === 2 && <p className='subtitle'>-</p>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <br />
                                    <button className='theme' type="submit" disabled={isSubmitting}>
                                        <i className="bi bi-check-circle"></i> &nbsp;Verify Code
                                    </button>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <p className="heading-2 grey">New Password</p>
                                    <LabelPasswordField
                                        id="new_password"
                                        placeholder="Enter new password"
                                        register={register}
                                        requiredMessage="New password is required"
                                        errors={errors}
                                    />
                                    <br />
                                    <p className="heading-2 grey">Confirm Password</p>
                                    <LabelPasswordField
                                        id="confirm_password"
                                        placeholder="Confirm new password"
                                        register={register}
                                        requiredMessage="Confirm password is required"
                                        errors={errors}
                                    />
                                    <br />
                                    <button className='theme' type="submit" disabled={!newPassword || !confirmPassword || isSubmitting}>
                                        <i className="bi bi-shield-lock"></i> &nbsp;Reset Password
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResetPasswordForm;