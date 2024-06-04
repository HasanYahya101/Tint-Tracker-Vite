import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Upload from "./upload";

export function Playground() {

    const [image, setImage] = useState(null);

    const [imageUploaded, setImageUploaded] = useState(false);

    useEffect(() => {
        localStorage.removeItem('uploadedImage');
    }, []);

    if (!imageUploaded) {
        return (
            <Upload setImage={setImage} setImageUploaded={setImageUploaded} image={image} imageUploaded={imageUploaded}
            />
        );
    }
    else {
        return (
            <div>
                hello
            </div>
        );
    }

}

