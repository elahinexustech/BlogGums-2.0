import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../Functions/CropImageHelper';
import Cookies from 'js-cookie';

import './style.css'

// Import environment variables
const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const ProfileImageUploader = ({ onClose }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [title, setTitle] = useState('Choose a Picture!')

    const handleImageDialogue = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setImageSrc(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
        setTitle('Crop & Save!');
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropAndUpload = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            const formData = new FormData();
            formData.append('image', croppedImage, 'cropped-image.jpg');

            const response = await fetch(`${SERVER}:${PORT}/api/user/update_profile_pic`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get(ACCESS_TOKEN)}`
                },
                body: formData,
            });

            if (response.ok) {
                location.reload()
            } else {
                alert('Image upload failed. Try again!');
            }
        } catch (error) {
            console.error('Error cropping and uploading image:', error);
        }
    };

    return (
        <div className="image-uploader flex direction-col">
            <p className="subtitle">{title}</p>
            <br />
            {!imageSrc ? (
                <button onClick={handleImageDialogue}>Choose Image</button>
            ) : (
                <>
                    <div className="cropper-container flex direction-col">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Force 1:1 aspect ratio
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <br />
                    <section className='flex'>
                        <button onClick={handleCropAndUpload} className='success'>Crop and Upload</button>
                    </section>
                </>
            )}
        </div>
    );
};

export default ProfileImageUploader;
