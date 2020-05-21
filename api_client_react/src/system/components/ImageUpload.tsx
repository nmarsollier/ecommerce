import React, { useRef } from "react";

interface IProps {
    src: string;
    onChange: (image: string) => void;
}

export default function ImageUpload(props: IProps) {
    const fileInput = useRef<HTMLInputElement>(null)

    const imageClick = () => {
        if (!fileInput || !fileInput.current) {
            return
        }
        fileInput.current.click()
    }

    const imageSelect = () => {
        if (!fileInput || !fileInput.current) {
            return
        }
        const files = fileInput.current.files
        if (files == null) {
            return;
        }
        getBase64(
            (files)[0],
            (image) => {
                if (image && props.onChange) {
                    props.onChange(image);
                }
            });
    }

    return (
        <div>
            <img src={props.src}
                alt=""
                height="100"
                onClick={imageClick} />
            <input type="file"
                ref={fileInput}
                className="upload"
                accept="*"
                onChange={imageSelect}
                style={{ display: "none" }} />
        </div>
    );
}

function getBase64(file: File, cb: (image: string) => void) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        cb(reader.result as string);
    };
}
