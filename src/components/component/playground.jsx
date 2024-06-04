import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
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
    }, [imageUploaded]);

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


        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = pixel;

        setRValue(r);
        setGValue(g);
        setBValue(b);
        setHexValue(rgbToHex(r, g, b));

        // set hue, saturation, brightness
        const hsl = rgbToHsl(r, g, b);
        setDefaultHue(hsl.h);
        setDefaultSaturation(hsl.s);
        setDefaultBrightness(hsl.l);
    };

    const hexToRgb = (hex) => {
        const match = hex.replace(/#/, '').match(/.{1,2}/g);
        return {
            r: parseInt(match[0], 16),
            g: parseInt(match[1], 16),
            b: parseInt(match[2], 16),
        };
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d) + (g < b ? 6 : 0);
                    break;
                case g:
                    h = ((b - r) / d) + 2;
                    break;
                case b:
                    h = ((r - g) / d) + 4;
                    break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return { h, s, l };
    };

    function CopyRGB() {
        navigator.clipboard.writeText(`${rValue}, ${gValue}, ${bValue}`);
    }

    function CopyHEX() {
        navigator.clipboard.writeText(hexValue);
    }

    function CopyHSL() {
        navigator.clipboard.writeText(`${defaultHue}°, ${defaultSaturation}%, ${defaultBrightness}%`);
    }

    if (!imageUploaded) {
        return (
            <Upload setImage={setImage} setImageUploaded={setImageUploaded} image={image} imageUploaded={imageUploaded}
            />
        );
    }
    else {
        return (
            <div
                className="flex flex-col items-center justify-center p-4 h-screen bg-gray-100 dark:bg-gray-950 ">
                <div
                    className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-2 gap-6 p-6">
                        <div className="relative flex justify-center items-center h-full">
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
                            <div className="absolute inset-0 flex items-center justify-center border-black" style={{ userSelect: "none", overflow: "hidden", scrollbarWidth: "none" }}>
                                <div className="max-w-full max-h-full relative bg-black dark:bg-white rounded-lg border-black shadow-lg object-cover content-center overflow-auto" style={{ aspectRatio: "500/500", objectFit: "cover", scrollbarWidth: "none" }}>
                                    {image !== null ? <img src={image} onClick={handleImageClick} alt="Uploaded Image" className="object-contain place-self-center" /> : <EyeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
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
                                    <div className="w-20 text-sm font-medium text-gray-500 dark:text-gray-400"
                                    >HEX</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{hexValue}</div>
                                        <Button variant="ghost" onClick={CopyHEX} className="max-h-12 max-w-12">
                                            <CopyIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Hue</div>
                                    <Slider className="flex-1" defaultValue={[defaultHue]} max={360} step={1} onChange={(value) => setDefaultHue(value)}
                                    />
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">{defaultHue}°</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Saturation</div>
                                    <Slider className="flex-1" defaultValue={[defaultSaturation]} max={100} step={1} onChange={(value) => setDefaultSaturation(value)}
                                    />
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">{defaultSaturation}%</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Brightness</div>
                                    <Slider className="flex-1" defaultValue={[defaultBrightness]} max={100} step={1} onChange={(value) => setDefaultBrightness(value)}
                                    />
                                    <div
                                        className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">{defaultBrightness}%</div>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" onClick={CopyRGB}
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">RGB</Button>
                                    <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-50">{rValue}, {gValue}, {bValue}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" onClick={CopyHSL}
                                        className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">HSL</Button>
                                    <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-50">{defaultHue}°, {defaultSaturation}%, {defaultBrightness}%</div>
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
function CopyIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" viewBox="0 0 115.77 122.88" style={{ enableBackground: 'new 0 0 115.77 122.88' }} xmlSpace="preserve">
            <style type="text/css">{`.st0{fill-rule:evenodd;clip-rule:evenodd;}`}</style>
            <g>
                <path className="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" />
            </g>
        </svg>
    );
}

