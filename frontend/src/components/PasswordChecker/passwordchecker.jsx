import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN, PORT, REFRESH_TOKEN, SERVER, USER_DATA } from '../../_CONSTS_';

import LabelPasswordField from '../LabelPasswordField/labelpasswordfield';

const PasswordChecker = ({ isOpen, onClose, deletPost, id }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [passVisibility, setPassVisibility] = useState(false);
    const [password, setPassword] = useState('');

    const { user } = JSON.parse(localStorage.getItem(USER_DATA));

    const onSubmit = async (data) => {
        const response = await fetch(`${SERVER}:${PORT}/api/user/check_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
            },
            body: JSON.stringify({ refresh: localStorage.getItem(REFRESH_TOKEN), password: data.password })
        })

        const result = await response.json();
        if(result.status === 200) {
            onClose();
            deletPost(id);
        }
    };

    if (!isOpen) return null;

    return (

        <div className="windows opened" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100' }}>
            <button onClick={onClose} className="transparent closeBtn icon">
                <i className="bi bi-x-lg"></i>
            </button>
            <div className="window opened dialogue-container" style={{ width: '40%' }}>

                <section className='flex jc-start'>
                    <img src={user.profile_image_url || ""} alt={`${user.username} picture`} className='profile-picture size-icon' />
                    <p className="heading">{user.first_name} {user.last_name}</p>
                </section>

                <br />

                <form className="flex direction-col jc-start ai-start" onSubmit={handleSubmit(onSubmit)}>
                    <p className="subtitle">Enter your Password!</p>
                    <br /><br />
                    <LabelPasswordField
                        id="password"
                        placeholder="password"
                        register={register}
                        requiredMessage="Password is required"
                        errors={errors}
                        passVisibility={passVisibility}
                        setPassVisibility={setPassVisibility}
                    />
                    <br />
                    {errors.password && <span className="error-message">{errors.password.message}</span>}

                    <button disabled={isSubmitting} className="submit-btn" type="submit">
                        {isSubmitting ? 'Checking.....' : 'Check Password'}
                    </button>

                </form>
                <br />
                <p className='grey'>Forgot your password, <Link className='colored' to={'/resetpassword'}>reset here</Link></p>
            </div>
        </div>

    );
};

export default PasswordChecker;