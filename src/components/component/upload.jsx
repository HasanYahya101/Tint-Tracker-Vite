import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function Component({ image, setImage, setImageUploaded, imageUploaded }) {

    const fileInputRef = useRef(null);
    const [colors, setColors] = useState([]);

    useEffect(() => {
        const storedImage = localStorage.getItem('uploadedImage');
        if (storedImage) {
            setImage(storedImage);
            extractColorsFromBase64(storedImage);
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;
            setImage(base64data);
            localStorage.setItem('uploadedImage', base64data);
            extractColorsFromBase64(base64data);
        };
        reader.readAsDataURL(file);

        setImageUploaded(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;
            setImage(base64data);
            localStorage.setItem('uploadedImage', base64data);
            extractColorsFromBase64(base64data);
        };
        reader.readAsDataURL(file);
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setImage(null);
        setColors([]);
        localStorage.removeItem('uploadedImage');
    };

    useEffect(() => {
        removeImage();
    }, [image]);

    const extractColorsFromBase64 = async (base64data) => {
        try {
            const img = new Image();
            img.src = base64data;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const colorMap = {};
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];
                    const hex = rgbToHex(r, g, b);
                    if (colorMap[hex]) {
                        colorMap[hex].count++;
                    } else {
                        colorMap[hex] = { count: 1, r, g, b };
                    }
                }
                const sortedColors = Object.entries(colorMap)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .slice(0, 12)
                    .map(([hex, { r, g, b }]) => ({ hex, r, g, b }));
                setColors(sortedColors);
            };
        } catch (error) {
            console.error("Error extracting colors:", error);
        }
    };

    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-4xl w-full p-2">
                <div
                    className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleDivClick}
                >
                    {image ? (
                        <img src={image} alt="Uploaded Image" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-lg">Click to upload an Image</div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
        </div>
    )
}