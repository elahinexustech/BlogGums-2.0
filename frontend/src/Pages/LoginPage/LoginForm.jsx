import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { NotificationsContext } from '../../components/Notifications/Notifications';
import { Helmet } from 'react-helmet';
import './login.css';
import Footer from '../../components/Footer/Footer';
import FormView from '../../components/FormView/FormView';
import Cookies from 'js-cookie'; // Import js-cookie


// Import environment variables
import {
    BASE_URL,
    ACCESS_TOKEN,
    REFRESH_TOKEN
} from '../../_CONSTS_.js';


const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { addNotification, removeNotification } = useContext(NotificationsContext)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const r = await fetch(`${BASE_URL}/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });


            const resp = await r.json();
            if (resp.access && resp.refresh) {
                // Save tokens in cookies
                Cookies.set(ACCESS_TOKEN, resp.access, { expires: 7 }); // Token expires in 7 days
                Cookies.set(REFRESH_TOKEN, resp.refresh, { expires: 7 }); // Token expires in 7 days
                addNotification('Logged In', 'success');
                window.location.href = '/';
            } else {
                setErrorMessage('Invalid credentials. Please try again.');
                addNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            setErrorMessage('An error occurred. Please try again later.');
            addNotification(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
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
            label: 'Password',
            type: 'password',
            id: 'password',
            placeholder: 'Enter your password',
            requiredMessage: 'Password is required',
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
                <title>Login to BlogGums</title>
            </Helmet>
            <FormView
                type={'login'}
                title={'Login'}
                subtitle={'to BlogGums'}
                features={features}
                step={1}
                fields={fields}
                errorMessage={errorMessage}
                onSubmit={handleSubmit(onSubmit)}
                buttonText={'Login'}
                linkMessage={{ msg: 'Don\'t have an account?', link: '/signup', linkText: 'Register' }}
                register={register}
                errors={errors}
                disabled={isSubmitting}
            />
            <Footer />
        </>
    );
};

export default LoginForm;
