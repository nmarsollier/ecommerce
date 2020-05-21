import React, { useState } from "react";
import "../styles.css";
import DangerLabel from "../system/components/DangerLabel";
import ErrorLabel from "../system/components/ErrorLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormLabel from "../system/components/FormLabel";
import FormTitle from "../system/components/FormTitle";
import ImageUpload from "../system/components/ImageUpload";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { getPictureUrl, saveImage } from "./ImageApi";

export default function UploadPicture(props: DefaultProps) {
    const [imageId, setImageId] = useState<string>()
    const [image, setImage] = useState<string>()

    const errorHandler = useErrorHandler()

    const updateImageState = (img: string) => {
        setImage(img);
    }

    const saveImageClick = async () => {
        try {
            errorHandler.cleanRestValidations();
            if (!image) {
                return;
            }
            const result = await saveImage({
                image
            });
            setImageId(result.id);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <FormTitle>Agregar Imagen</FormTitle>

            <Form>
                <div className="form-group">
                    <ImageUpload src={getPictureUrl(image)}
                        onChange={updateImageState} />
                    <ErrorLabel message={errorHandler.getErrorText("name")} />
                </div>

                <FormLabel label="Id Imagen" text={imageId} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton hidden={imageId !== undefined} label="Subir" onClick={saveImageClick} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>

            </Form>
        </div>
    );
}
