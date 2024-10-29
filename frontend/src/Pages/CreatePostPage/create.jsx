import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';

import { SERVER, PORT, ACCESS_TOKEN } from '../../_CONSTS_';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';

import './create.css';

const CreatePage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        let access_token = localStorage.getItem(ACCESS_TOKEN);

        // Append the Markdown content and status to the data object
        const postData = {
            ...data,
            content: value, // Add content from the MDEditor
            status: watch('status') // Get the selected status
        };

        let response = await fetch(`${SERVER}:${PORT}/blogs/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(postData) // Send the complete data object
        });

        let resp = await response.json();
        console.log(resp);
        setIsSubmitting(false); // Reset submitting state
    };

    return (
        <>
            <NavigationMenu />

            <div className="container">
                <div className="content-container flex direction-col">
                    <p className="heading">Create new post</p><br />
                    <form className='flex direction-col jc-start ai-start obj' onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            placeholder="Blog Title"
                            id="title"
                            className='obj-trans'
                            autoFocus
                            {...register("title", { required: "Enter a good title" })}
                        />
                        {errors.title && <span className="error">{errors.title.message}</span>}
                        <br /><br />
                        <MDEditor
                            className='blogeditor'
                            value={value}
                            onChange={setValue}
                            height={'--editor-height'}
                        />
                        <br /><br />
                        <label htmlFor="status">Blog Status</label>
                        <select id="status" className='obj-trans' {...register("status", { required: "Select a status" })}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                        {errors.status && <span className="error">{errors.status.message}</span>}
                        <br /><br />
                        <button
                            disabled={isSubmitting}
                            className='submit-btn'
                        >
                            {isSubmitting ? 'Saving...' : 'Save Post'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreatePage;
