import React from "react";
import { Quality } from "../image/ImageApi";
import ShowImage from "../image/ShowImage";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import { findArticles, IArticle } from "./CatalogApi";

interface IState {
    text?: string;
    articles?: IArticle[];
}

export default class SearchArticle extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            text: "",
        };
    }

    public search = async () => {
        try {
            const text = this.state.text;
            if (text) {
                const articles = await findArticles(text);
                this.setState({
                    articles,
                });
            }
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public showImage = (imageId: string | undefined) => {
        if (imageId !== undefined) {
            this.props.history.push("/showPicture/" + imageId);
        }
    }

    public editArticle = (id: string | undefined) => {
        if (id !== undefined) {
            this.props.history.push("/editArticle/" + id);
        }
    }

    public render() {
        let articles;
        if (this.state.articles) {
            articles = (
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
                            {this.state.articles.map((article, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{article._id}</td>
                                        <td>{article.name}</td>
                                        <td>{article.description}</td>
                                        <td>
                                            {article.image}&nbsp;
                                            <a hidden={!article.image} onClick={() => this.showImage(article.image)} >
                                                <img src="/assets/find.png" />
                                            </a>
                                        </td>
                                        <td>{article.stock}</td>
                                        <td>{article.price}</td>
                                        <td>
                                            <a onClick={() => this.editArticle(article._id)} >
                                                <img src="/assets/edit.png" />
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="global_content" >
                <h2 className="global_title">Buscar Artículos</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Buscar Artículos</label>
                        <input id="text" type="text"
                            onChange={this.updateState}
                            className={this.getErrorClass("text", "form-control")}>
                        </input>
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">{this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.search}>Buscar</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >

                {articles}
            </div>
        );
    }
}
