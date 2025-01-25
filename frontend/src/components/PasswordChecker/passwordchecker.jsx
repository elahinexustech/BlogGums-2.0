import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { NotificationsContext } from '../Notifications/Notifications';
import LabelPasswordField from '../LabelPasswordField/labelpasswordfield.jsx';
import { AuthContext } from '../AuthUser/AuthProvider';
import './passwordchecker.css';

// Import environment variables
import {
    SERVER,
    PORT,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
} from '../../_CONSTS_';


const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';


const PasswordChecker = ({ isOpen, onClose, id }) => {
    const { addNotification } = useContext(NotificationsContext);
    const { userData } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [passVisibility, setPassVisibility] = useState(false);

    const deleteBlogPost = async (id) => {

        const response = await fetch(`${BASE_URL}/blogs/post/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${Cookies.get(ACCESS_TOKEN)}`
            },
            body: JSON.stringify({ refresh: Cookies.get(REFRESH_TOKEN), post_id: id })
        })

        const data = await response.json();
        if (data.status === 200) {
            addNotification('Blog Post deleted successfully', 'success');
        } else if (data.status == 404) {
            addNotification('Blog Post not Found', 'error');
        } else if (data.status == 500) {
            addNotification('There is a server error in the request', 'error');
        }
    }

    const onSubmit = async (data) => {
        const response = await fetch(`${BASE_URL}/api/user/check_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${Cookies.get(ACCESS_TOKEN)}`
            },
            body: JSON.stringify({ refresh: Cookies.get(REFRESH_TOKEN), password: data.password })
        })

        const result = await response.json();



        if (result.status === 200) {
            deleteBlogPost(id);
        }
    };

    if (!isOpen) return null;

    return (

        <div className="passchecker windows opened" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100' }}>
            <div className="window opened pass-dialogue-container" style={{ width: '40%' }}>
                <button onClick={onClose} className="transparent closeBtn icon">
                    <i className="bi bi-x-lg"></i>
                </button>
                <br /><br />
                <section className='flex direction-col header'>
                    <img src={userData.user.profile_image_url || ""} alt={`${userData.user.username} picture`} className='profile-picture size-m' />
                    <br />
                    <p className="text">{userData.user.first_name} {userData.user.last_name}</p>
                </section>

                <br />

                <form className="flex direction-col jc-start ai-start" onSubmit={handleSubmit(onSubmit)}>
                    <p className="heading-2">Enter your Password!</p>
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