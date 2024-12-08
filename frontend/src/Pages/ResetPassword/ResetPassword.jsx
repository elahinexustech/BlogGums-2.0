import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';
import './reset.css';
import { ACCESS_TOKEN, PORT, SERVER } from '../../_CONSTS_';

const ResetPasswordForm = () => {
    const [step, setStep] = useState(1); // Track the current step
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const access_token = localStorage.getItem(ACCESS_TOKEN) || ''

    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const reset_email = watch('reset_email');
    const newPassword = watch('new_password');
    const confirmPassword = watch('confirm_password');

    // Handle form submission based on the step
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            if (step === 1) {
                // `${SERVER}:${PORT}/api/sendcode`
                // Step 1: Send reset code to email
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
                } else {
                    setErrorMessage('Failed to send reset code. Please try again.');
                }
            } else if (step === 2) {
                // Step 2: Verify reset code
                const response = await fetch(`${SERVER}:${PORT}/api/verifycode`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email, code: data.reset_code }),
                });

                if (response.ok) {
                    setResetCode(data.reset_code);
                    setStep(3);
                } else {
                    setErrorMessage('Invalid code. Please try again.');
                }
            } else if (step === 3) {
                // Step 3: Update the password
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
                    navigate('/login'); // Redirect to login after successful password reset
                } else {
                    setErrorMessage('Failed to reset password. Please try again.');
                }
            }
        } catch (error) {
            console.log(error)
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="container flex login-container">
                <div className="obj form-container">
                    <h1>Reset Password</h1>
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
                                <LabelField
                                    id="reset_code"
                                    placeholder="Enter the reset code"
                                    register={register}
                                    requiredMessage="Reset code is required"
                                    errors={errors}
                                />
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
