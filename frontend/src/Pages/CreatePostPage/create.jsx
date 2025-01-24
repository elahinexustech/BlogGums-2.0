import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import MDEditor from '../../components/MDEditor/MDEditor';
import { NotificationsContext } from '../../components/Notifications/Notifications';
import './create.css';
import { AuthContext } from '../../components/AuthUser/AuthProvider';
import Cookies from 'js-cookie';

// Import environment variables
const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const CreatePage = ({ isOpen, onClose }) => {
    const { userData } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationsContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const [pageState, setPageState] = useState(1)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        let access_token = Cookies.get(ACCESS_TOKEN);

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
        setPageState(2);
    };
    if (!isOpen) return null; // Only render if open

    return (
        <div className="windows opened">
            <div className="window opened create-dialogue-container flex direction-col">
                <button onClick={onClose} className="transparent closeBtn icon">
                    <i className="bi bi-x-lg"></i>
                </button>
                {pageState === 1? (
                    <>
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
                    </>
                ): (
                    <>
                        <section className="flex direction-col">
                            <i className="bi bi-check-circle success-i"></i>  
                            <p className="subtitle success-p">Post Added</p>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreatePage;
