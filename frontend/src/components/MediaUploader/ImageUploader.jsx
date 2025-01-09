import React, { useState } from 'react';

// CSS
import './uploader.css';
import { ACCESS_TOKEN, PORT, SERVER } from '../../_CONSTS_';

const MediaUploader = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

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
        
        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            formData.append(`file${index + 1}`, file); // Append files to the FormData
        });


        let r = await fetch(`${SERVER}:${PORT}/blogs/upload/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
            },
            body: formData
        })
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
            <button className="obj" onClick={triggerFileInput}>
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
                    <button className='uploadBtn' onClick={handleFileUpload}><i className="bi bi-check"></i></button>
                </ul>
            )}
        </div>
    );
};

export default MediaUploader;
