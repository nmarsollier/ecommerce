import React, { useEffect, useState } from "react";
import "../styles.css";
import DangerLabel from "../system/components/DangerLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormInput from "../system/components/FormInput";
import FormTitle from "../system/components/FormTitle";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { Quality } from "./ImageApi";
import ShowImage from "./ShowImage";

export default function SearchPicture(props: DefaultProps) {
    const [tmpId, setTmpId] = useState("")
    const [imageId, setImageId] = useState<string>()

    const errorHandler = useErrorHandler()

    const searchImage = () => {
        if (tmpId) {
            setImageId(tmpId);
        }
    }

    useEffect(() => {
        const id = props.match.params.imageId;
        if (id) {
            setTmpId(id)
            setImageId(id);
        }
    }, [])


    return (
        <div className="global_content" >
            <FormTitle>Buscar Imagen</FormTitle>

            <Form>
                <FormInput
                    label="Id Imagen"
                    name="tmpId"
                    onChange={e => setTmpId(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Buscar" onClick={searchImage} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>

                <ShowImages imageId={imageId} />ºº
            </Form>
        </div >
    );
}

interface ShowImagesProps extends DefaultProps {
    imageId?: string
}

function ShowImages(props: ShowImagesProps) {
    if (!props.imageId) {
        return null
    }
    return (
        <div>
            <br />
            <ShowImage imageId={props.imageId} quality={Quality.Q160} jpeg={true} />
            <ShowImage imageId={props.imageId} quality={Quality.Q320} jpeg={true} />
            <ShowImage imageId={props.imageId} quality={Quality.Q640} />
            <ShowImage imageId={props.imageId} quality={Quality.Q800} />
            <ShowImage imageId={props.imageId} quality={Quality.Q1024} />
            <ShowImage imageId={props.imageId} quality={Quality.Q1200} />
            <ShowImage imageId={props.imageId} />
        </div>
    )
}
