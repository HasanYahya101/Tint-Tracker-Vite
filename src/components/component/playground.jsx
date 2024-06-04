import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Upload from "./upload";
import { Slider } from "@/components/ui/slider";

export function Playground() {

    const [image, setImage] = useState(null);

    const [imageUploaded, setImageUploaded] = useState(false);

    const [defaultHue, setDefaultHue] = useState(0);

    const [defaultSaturation, setDefaultSaturation] = useState(100);

    const [defaultBrightness, setDefaultBrightness] = useState(100);

    const [rValue, setRValue] = useState(255);

    const [gValue, setGValue] = useState(0);

    const [bValue, setBValue] = useState(0);

    const [hexValue, setHexValue] = useState("#FF0000");



    const rgbToHex = (r, g, b) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    useEffect(() => {
        localStorage.removeItem('uploadedImage');
    }, []);

    useEffect(() => {
        const storedImage = localStorage.getItem('uploadedImage');
        if (storedImage) {
            setImage(storedImage);
            extractColorsFromBase64(storedImage);
        }
    }, []);

    const extractColorsFromBase64 = (base64) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            const colors = [];
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                if (a > 0) {
                    const hex = rgbToHex(r, g, b);
                    colors.push(hex);
                }
            }
            const colorMap = {};
            colors.forEach((color) => {
                if (color in colorMap) {
                    colorMap[color] += 1;
                } else {
                    colorMap[color] = 1;
                }
            });
            const sortedColors = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
            const dominantColor = sortedColors[0];
            const rgb = hexToRgb(dominantColor);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            setDefaultHue(hsl.h);
            setDefaultSaturation(hsl.s);
            setDefaultBrightness(hsl.l);
        };
    };

    const handleImageClick = (event) => {
        const img = event.target;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const rect = img.getBoundingClientRect();
        const scaleX = img.width / rect.width;
        const scaleY = img.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const [r, g, b] = pixel;

            setRValue(r);
            setGValue(g);
            setBValue(b);
            setHexValue(rgbToHex(r, g, b));
        }
    };

    if (!imageUploaded) {
        return (
            <Upload setImage={setImage} setImageUploaded={setImageUploaded} image={image} imageUploaded={imageUploaded}
            />
        );
    }
    else {
        return (
            <div
                className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
                <div
                    className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-2 gap-6 p-6">
                        <div className="relative">
                            <img
                                alt="Uploaded Image"
                                className="w-full h-full object-cover rounded-lg"
                                height={500}
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "500/500",
                                    objectFit: "cover",
                                }}
                                width={500} />
                            <div className="absolute inset-0 flex items-center justify-center border-black">
                                <div className="bg-black dark:bg-white rounded-lg border-black shadow-lg object-cover overflow-hidden" style={{ aspectRatio: "500/500", objectFit: "cover" }}>
                                    {image !== null ? <img src={image} onClick={handleImageClick}
                                        alt="Uploaded Image" className="w-full h-full object-contain" /> : <EyeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full"
                                        style={{ backgroundColor: rgbToHex(rValue, gValue, bValue) }}
                                    />
                                </div>
                                <div className="flex-1 grid gap-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">HEX</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{hexValue}</div>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Hue</div>
                                    <Slider className="flex-1" defaultValue={[0]} max={360} step={1} />
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">0°</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Saturation</div>
                                    <Slider className="flex-1" defaultValue={[100]} max={100} step={1} />
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">100%</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Brightness</div>
                                    <Slider className="flex-1" defaultValue={[100]} max={100} step={1} />
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">100%</div>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">RGB</div>
                                    <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-50">{rValue}, {gValue}, {bValue}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">HSL</div>
                                    <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-50">0°, 100%, 50%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

function EyeIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>)
    );
}
