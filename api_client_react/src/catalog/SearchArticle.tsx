import React, { useState } from "react";
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
import { findArticles, IArticle } from "./CatalogApi";

export default function SearchArticle(props: DefaultProps) {
    const [text, setText] = useState("")
    const [articles, setArticles] = useState(new Array<IArticle>())

    const errorHandler = useErrorHandler()

    const search = async () => {
        try {
            if (text) {
                const articleResult = await findArticles(text);
                setArticles(articleResult);
            }
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const showImage = (imageId: string | undefined) => {
        if (imageId !== undefined) {
            props.history.push("/showPicture/" + imageId);
        }
    }

    const editArticle = (id: string | undefined) => {
        if (id !== undefined) {
            props.history.push("/editArticle/" + id);
        }
    }

    return (
        <div className="global_content" >
            <FormTitle>Buscar Artículos</FormTitle>

            <Form>
                <FormInput
                    label="Buscar Artículos"
                    name="text"
                    onChange={e => setText(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Buscar" onClick={search} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form>

            <ArticlesList articles={articles} onEditClick={editArticle} onShowImage={showImage} />
        </div>
    );
}

interface ArticlesListProps extends DefaultProps {
    articles?: IArticle[],
    onShowImage: (imageId: string | undefined) => any,
    onEditClick: (id: string | undefined) => any
}

function ArticlesList(props: ArticlesListProps) {
    if (!props.articles) {
        return null
    }
    return (
        <div>
            <br />
            <table id="articles" className="table">
                <thead>
                    <tr>
                        <th> Id </th>
                        <th> Nombre </th>
                        <th> Descripción </th>
                        <th> Imagen </th>
                        <th> Stock </th>
                        <th> Precio </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {props.articles.map((article, i) => {
                        return (
                            <tr key={i}>
                                <td>{article._id}</td>
                                <td>{article.name}</td>
                                <td>{article.description}</td>
                                <td>
                                    {article.image}&nbsp;
                                                <a hidden={!article.image} onClick={() => props.onShowImage(article.image)} >
                                        <img src="/assets/find.png" />
                                    </a>
                                </td>
                                <td>{article.stock}</td>
                                <td>{article.price}</td>
                                <td>
                                    <a onClick={() => props.onEditClick(article._id)} >
                                        <img src="/assets/edit.png" />
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div >
    )
}
