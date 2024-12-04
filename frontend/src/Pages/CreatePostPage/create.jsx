import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MDEditor from '../../components/MDEditor/MDEditor';

import { SERVER, PORT, ACCESS_TOKEN, USER_DATA } from '../../_CONSTS_';
import './create.css';

const CreatePage = ({ isOpen, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { user } = JSON.parse(localStorage.getItem(USER_DATA));

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
        console.log(resp);
        setIsSubmitting(false);
    };

    if (!isOpen) return null; // Only render if open

    return (
        <div className="windows opened">
            <div className="window opened dialogue-container">
                <button onClick={onClose} className="transparent closeBtn icon">
                    <i className="bi bi-x-lg"></i>
                </button>

                <section className='flex jc-start'>
                    <img src={user.profile_image_url || ""} alt={`${user.username} picture`} className='profile-picture size-icon' />
                    <p className="heading">{user.first_name} {user.last_name}</p>
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
