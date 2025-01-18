import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import MDEditor from '../../components/MDEditor/MDEditor';
import { NotificationsContext } from '../../components/Notifications/Notifications';
import { SERVER, PORT, ACCESS_TOKEN, USER_DATA } from '../../_CONSTS_';
import './create.css';
import { AuthContext } from '../../components/AuthUser/AuthProvider';

const CreatePage = ({ isOpen, onClose }) => {
    const  {userData } = useContext(AuthContext);
    const { addNotification, removeNotification } = useContext(NotificationsContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        let access_token = localStorage.getItem(ACCESS_TOKEN);

        const postData = {
            ...data,
            content: value,
            status: watch('status')
        };

        let response = await fetch(`${SERVER}:${PORT}/blogs/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(postData)
        });

        let resp = await response.json();
        setIsSubmitting(false);
        addNotification('Post added Successfully', 'success');
    };
    if (!isOpen) return null; // Only render if open

    return (
        <div className="windows opened">
                <button onClick={onClose} className="transparent closeBtn icon">
                    <i className="bi bi-x-lg"></i>
                </button>
            <div className="window opened dialogue-container">

                <section className='flex jc-start'>
                    <img src={userData.user.profile_image_url || ""} alt={`${userData.user.username} picture`} className='profile-picture size-icon' />
                    <p className="heading">{userData.user.first_name} {userData.user.last_name}</p>
                </section>

                <form className="flex direction-col jc-start ai-start" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="Blog Title"
                        id="title"
                        autoFocus
                        {...register("title", { required: "Enter a good title" })}
                    />
                    {errors.title && <span className="error">{errors.title.message}</span>}
                    <br /><br />
                    <MDEditor
                        className="blogeditor"
                        value={value}
                        onChange={setValue}
                        id="blog"
                    />
                    <br /><br />
                    <button disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? 'Saving...' : 'Save Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePage;
