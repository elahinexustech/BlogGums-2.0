export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg');
        };
        image.onerror = (error) => reject(error);
    });
};
