import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';
import './reset.css';
import { ACCESS_TOKEN, PORT, SERVER, USER_DATA } from '../../_CONSTS_';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import { Helmet } from 'react-helmet';

const ResetPasswordForm = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [STEP_TITLE, setStepTitle] = useState('Reset Password')
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
                    setStepTitle('Enter 6-Digit Code')
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
                    setStepTitle('New password')
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
            {isLoggedIn && <NavigationMenu />}
            <div className="container flex login-container">
                <div className="obj form-container">
                    <h1>{STEP_TITLE}</h1>
                    <br />
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <form
                        className="flex direction-col jc-start ai-start"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {step === 1 && (
                            <>
                                <LabelField
                                    id="reset_email"
                                    placeholder="Enter your email"
                                    register={register}
                                    requiredMessage="Email is required"
                                    errors={errors}
                                />
                                <br />
                                <button
                                    className="theme"
                                    type="submit"
                                    disabled={!reset_email || isSubmitting}
                                >
                                    <i className="bi bi-box-arrow-right"></i> &nbsp;Send Code
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
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
                                <button
                                    className="theme"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <i className="bi bi-check-circle"></i> &nbsp;Verify Code
                                </button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <LabelPasswordField
                                    id="new_password"
                                    placeholder="Enter new password"
                                    register={register}
                                    requiredMessage="New password is required"
                                    errors={errors}
                                />
                                <LabelPasswordField
                                    id="confirm_password"
                                    placeholder="Confirm new password"
                                    register={register}
                                    requiredMessage="Confirm password is required"
                                    errors={errors}
                                />
                                <br />
                                <button
                                    className="theme"
                                    type="submit"
                                    disabled={!newPassword || !confirmPassword || isSubmitting}
                                >
                                    <i className="bi bi-shield-lock"></i> &nbsp;Reset Password
                                </button>
                            </>
                        )}
                    </form>
                    <p className="grey caption">
                        <Link className="colored" to="/">Go Back</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ResetPasswordForm;