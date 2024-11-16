import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

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

        toast.success("Image uploaded successfully", {
            action:
            {
                text: 'Close',
                onClick: () => {
                    toast.dismiss();
                }
            }
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        // if file is not an image
        if (!e.dataTransfer.files[0].type.includes('image')) {
            toast.error("File type not supported", {
                action:
                {
                    label: 'Close',
                    onClick: () => {
                        toast.dismiss();
                    }
                }
            });
            return;
        }
        const file = e.dataTransfer.files[0];
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

    const { setTheme } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="fixed top-6 right-6 z-50">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Toaster />
            <div className="max-w-4xl w-full p-4">
                <div
                    className="w-full aspect-video bg-gray-200 dark:bg-gray-800 hover:bg-opacity-60 dark:hover:bg-opacity-80 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleDivClick}
                    style={{ border: imageUploaded ? 'none' : '3px dashed #ccc' }}
                >
                    {image ? (
                        <img src={image} alt="Uploaded Image" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-lg">Click or Drop an Image to upload it</div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    limit="1"
                />
            </div>
        </div>
    )
}