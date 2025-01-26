import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import LabelPasswordField from '../LabelPasswordField/LabelPasswordField.jsx';
import LabelField from '../LabelField/LabelField.jsx'
import { NotificationsContext } from '../../components/Notifications/Notifications';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Import environment variables
import {
    SERVER,
    PORT,
    ACCESS_TOKEN,
    REFRESH_TOKEN
} from '../../_CONSTS_.js';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';

const LoginWindow = ({ isOpen, onClose }) => {
    const { addNotification } = useContext(NotificationsContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`${BASE_URL}/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const resp = await response.json();
            if (resp.access && resp.refresh) {
                Cookies.set(ACCESS_TOKEN, resp.access, { expires: 7 });
                Cookies.set(REFRESH_TOKEN, resp.refresh, { expires: 7 });
                addNotification('Logged in successfully!', 'success');
                window.location.reload(); // Reload the page on successful login
            } else {
                throw new Error('Invalid credentials.');
            }
        } catch (error) {
            console.error(error);
            addNotification('Login failed. Please check your credentials and try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null; // Only render if the window is open

    return (
        <div className="windows opened">
            <div className="window opened flex direction-col">
                <button
                    onClick={onClose}
                    className="transparent closeBtn icon"
                >
                    <i className="bi bi-x-lg"></i>
                </button>


                <section className="body flex direction-col">
                    <section className="flex direction-col">
                        <img src={'/imgs/icon.png'} className="icon" />
                        <p className="text">Login to your account</p>
                    </section>
                    <br />
                    <form className='flex direction-col jc-start ai-start' onSubmit={handleSubmit(onSubmit)}>
                        <div className={'flex direction-col jc-start ai-start'}>
                            <div className="form-group">
                                <section>
                                    <p className="heading-2 grey">Username</p>
                                    <LabelField
                                        type={'text'}
                                        id={'username'}
                                        placeholder={'eg. mabdullah.elahi'}
                                        register={register}
                                        requiredMessage={'Username please, NOTE: username & email addresses are different'}
                                        errors={errors}
                                    />
                                </section>

                                <section>
                                    <p className="heading-2 grey">Username</p>
                                    <LabelPasswordField
                                        id={'password'}
                                        placeholder={'pa**word'}
                                        register={register}
                                        requiredMessage={"enter your password"}
                                        errors={errors}
                                    />
                                </section>

                                <br />
                            </div>
                        </div>
                        <br />
                        <>
                            <p className='grey caption flex'>
                                <i className="bi bi-key"></i> &nbsp; Forgot your Password, <Link className='colored' to={'/resetpassword'}>Reset here</Link>
                            </p>
                            <br />
                        </>

                        <button className='theme loader' disabled={isSubmitting}>
                            <i className="bi bi-box-arrow-right"></i> &nbsp;Login
                        </button>
                    </form>
                </section>

            </div>
        </div>
    );
};

export default LoginWindow;
