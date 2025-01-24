import React, { useContext, useState } from 'react';

// Components
import { NotificationsContext } from '../../components/Notifications/Notifications';

// CSS
import './uploader.css';

// Import environment variables
import {
    SERVER,
    PORT,
    ACCESS_TOKEN,
} from '../../_CONSTS_.js';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';

const MediaUploader = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {addNotification, removeNotification} = useContext(NotificationsContext);

    const allowedFileTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/tiff', 'image/heic',
        'video/mp4', 'video/mov', 'video/mkv',
        'audio/mp3', 'audio/m4a', 'audio/wav', 'audio/opus',
    ];
    const maxTotalSize = 5 * 1024 * 1024; // 5MB in bytes

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);

        // Reset previous messages
        setErrorMessage('');

        if (files.some(file => !allowedFileTypes.includes(file.type))) {
            setErrorMessage('One or more files have an unsupported format.');
            return;
        }

        if (totalSize > maxTotalSize) {
            setErrorMessage('Total file size exceeds 5MB. Please select smaller files.');
            return;
        }

        setUploadedFiles(files);
    };


    const handleFileUpload = async () => {

        setIsSubmitting(true);

        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            formData.append('media', file); // Append files to the FormData
        });


        let r = await fetch(`${BASE_URL}/blogs/upload/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
            },
            body: formData
        });

        let resp = await r.json();

        if(resp.status === 200) {
            addNotification(`${resp.uploaded_files.length} file${(resp.uploaded_files.length > 1)? 's': ''} uploaded succesfully!`, 'success');
            setUploadedFiles([]);
            setIsSubmitting(false);
        }
        
    }

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    return (
        <div className="img-uploader flex direction-col ai-end">
            {/* Hidden File Input */}
            <input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                multiple
                accept={allowedFileTypes.join(',')}
                style={{ display: 'none' }}
            />
            {/* Button to Trigger File Input */}
            <button className="obj" onClick={triggerFileInput} disabled={isSubmitting}>
                <i className="bi bi-upload"></i>
            </button>
            {errorMessage &&
                <div className="error error-message">
                    <br />
                    {errorMessage}
                </div>
            }
            {uploadedFiles.length > 0 && (
                <ul className="uploaded-files">
                    <br />
                    {uploadedFiles.map((file, index) => (
                        <li className='caption' key={index}>{file.name}</li>
                    ))}
                    <br />
                    <section className='flex jc-end'>

                        <button className='closeBtn circle small' onClick={()=> {setUploadedFiles([])}} disabled={isSubmitting}>
                            <i className="bi bi-x error"></i>
                        </button>

                        <button className='uploadBtn circle small' onClick={handleFileUpload} disabled={isSubmitting}>
                            <i className="bi bi-check-lg"></i>
                        </button>
                    </section>
                </ul>
            )}
        </div>
    );
};

export default MediaUploader;
