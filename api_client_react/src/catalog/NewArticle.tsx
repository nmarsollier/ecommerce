import React, { useEffect, useState } from "react";
import { getPictureUrl, saveImage } from "../image/ImageApi";
import "../styles.css";
import DangerLabel from "../system/components/DangerLabel";
import ErrorLabel from "../system/components/ErrorLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormInput from "../system/components/FormInput";
import FormTitle from "../system/components/FormTitle";
import FormWarnButton from "../system/components/FormWarnButton";
import ImageUpload from "../system/components/ImageUpload";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps, goHome, useForceUpdate } from "../system/utils/Tools";
import { deleteArticle, getArticle, newArticle, updateArticle } from "./CatalogApi";

export default function NewArticle(props: DefaultProps) {
    const [id, setId] = useState<string>()
    const [name, setName] = useState("")
    const [description, setDescription] = useState<string | undefined>("")
    const [image, setImage] = useState<string | undefined>("")
    const [price, setPrice] = useState<string | undefined>("0")
    const [stock, setStock] = useState<string | undefined>("0")

    const errorHandler = useErrorHandler()

    const loadArticle = async (articleId: string) => {
        errorHandler.cleanRestValidations();

        try {
            const article = await getArticle(articleId);
            setId(article._id)
            setDescription(article.description)
            setImage(article.image)
            setName(article.name)
            setPrice(article.price?.toFixed(2))
            setStock(article.stock?.toFixed(0))
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const addArticle = async () => {
        errorHandler.cleanRestValidations();

        try {
            if (id) {
                await updateArticle(id, {
                    _id: id,
                    name,
                    description,
                    image,
                    price: parseFloat(price ? price : "0"),
                    stock: parseInt(stock ? stock : "0", 10)
                });
            } else {
                await newArticle({
                    _id: id,
                    name,
                    description,
                    image,
                    price: parseFloat(price ? price : "0"),
                    stock: parseInt(stock ? stock : "0", 10)
                });
            }
            goHome(props);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const delArticle = async () => {
        errorHandler.cleanRestValidations();

        try {
            if (id) {
                await deleteArticle(id);
                goHome(props);
            }
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const saveImageClick = async (img: string) => {
        try {
            errorHandler.cleanRestValidations();
            if (!img) {
                return;
            }
            const result = await saveImage({
                image: img,
            });

            setImage(result.id);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    useEffect(() => {
        const paramId = props.match.params.id;
        if (paramId) {
            loadArticle(paramId);
        }
    }, [])

    return (
        <div className="global_content">
            <FormTitle>Detalle del Articulo</FormTitle>

            <Form>
                <FormInput
                    label="Nombre"
                    value={name}
                    name="name"
                    onChange={e => setName(e.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Descripción"
                    value={description}
                    name="description"
                    onChange={e => setDescription(e.target.value)}
                    errorHandler={errorHandler} />

                <div className="form-group">
                    <label>Imagen</label>
                    <ImageUpload
                        src={getPictureUrl(image)}
                        onChange={saveImageClick} />
                    <ErrorLabel message={errorHandler.getErrorText("image")} />
                </div>

                <FormInput
                    label="Precio"
                    value={price}
                    name="price"
                    onChange={e => setPrice(e.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Stock"
                    value={stock}
                    name="stock"
                    onChange={e => setStock(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label={id ? "Actualizar" : "Agregar"} onClick={addArticle} />
                    <FormWarnButton label="Eliminar" onClick={delArticle} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form>
        </div>
    );
}
