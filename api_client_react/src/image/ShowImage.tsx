import React, { useEffect, useState } from "react";
import "../styles.css";
import { DefaultProps } from "../system/utils/Tools";
import { getImage, IImage, Quality } from "./ImageApi";

export interface ShowImageProps extends DefaultProps {
    imageId?: string;
    quality?: Quality;
    jpeg?: boolean;
}

export default function ShowImage(props: ShowImageProps) {
    const [image, setImage] = useState<IImage>()

    const fetchImage = async () => {
        if (props.imageId !== undefined) {
            const img = await getImage(props.imageId, props.quality, props.jpeg);
            setImage(img);
        }
    }

    useEffect(() => {
        fetchImage();
    }, [])

    if (!props.imageId) {
        return null
    }
    return (
        <div >
            <img src={image ? image.image : ""} />
            <div className="text-block">
                <strong>{props.quality ? props.quality : "Original"}</strong>
            </div>
        </div>
    );
}
