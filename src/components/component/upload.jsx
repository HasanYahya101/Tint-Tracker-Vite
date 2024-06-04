import { useState } from "react"

export default function Upload() {
    const [image, setImage] = useState(null);
    const [colors, setColors] = useState([]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        setImage(URL.createObjectURL(file))
        extractColors(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setImage(URL.createObjectURL(file))
        extractColors(file)
    }

    const extractColors = async (file) => {
        try {
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = () => {
                const canvas = document.createElement("canvas")
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext("2d")
                ctx.drawImage(img, 0, 0)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const colorMap = {}
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i]
                    const g = imageData.data[i + 1]
                    const b = imageData.data[i + 2]
                    const hex = rgbToHex(r, g, b)
                    if (colorMap[hex]) {
                        colorMap[hex].count++
                    } else {
                        colorMap[hex] = { count: 1, r, g, b }
                    }
                }
                const sortedColors = Object.entries(colorMap)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .slice(0, 12)
                    .map(([hex, { r, g, b }]) => ({ hex, r, g, b }))
                setColors(sortedColors)
            }
        } catch (error) {
            console.error("Error extracting colors:", error)
        }
    }

    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }

    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex)
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-4xl w-full">
                <div
                    className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {image ? (
                        <img src="/placeholder.svg" alt="Uploaded Image" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-lg">Drag and drop an image or click to upload</div>
                    )}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                    {colors.map(({ hex, r, g, b }) => (
                        <div
                            key={hex}
                            className="bg-[#fff] dark:bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => copyToClipboard(hex)}
                        >
                            <div className="w-full aspect-square" style={{ backgroundColor: `#${hex.slice(1)}` }} />
                            <div className="px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">{hex}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}