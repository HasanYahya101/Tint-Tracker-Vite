import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Upload from "./upload";

export function Playground() {

    const [image, setImage] = useState(null);

    const [imageUploaded, setImageUploaded] = useState(false);

    if (!imageUploaded) {
        return (
            <Upload setImage={setImage} setImageUploaded={setImageUploaded}
            />
        );
    }
    else {
        return (
            <div>
                <div className="flex justify-center">
                    <Button
                        onClick={() => setImageUploaded(false)}
                        className="mt-4"
                    >
                        Upload another image
                    </Button>
                </div>
                <div className="flex justify-center">
                    <img src={image} alt="uploaded" className="mt-4" />
                </div>
                <div className="flex justify-center">
                    <Input
                        value={image}
                        className="mt-4"
                    />
                </div>
            </div>
        );
    }

}

