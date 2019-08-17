import React from "react";
import { getPictureUrl, saveImage } from "../image/ImageApi";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import ErrorLabel from "../system/tools/ErrorLabel";
import ImageUpload from "../system/tools/ImageUpload";
import { deleteArticle, getArticle, newArticle } from "./CatalogApi";

interface IState {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
    stock?: number;
}

export default class NewArticle extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            description: "",
            image: "",
            name: "",
            price: 0,
            stock: 0,
        };
    }

    public componentDidMount() {
        const id = this.props.match.params.id;
        if (id) {
            this.loadArticle(id);
        }
    }

    public loadArticle = async (id: string) => {
        this.cleanRestValidations();

        try {
            const article = await getArticle(id);

            this.setState({
                _id: article._id,
                description: article.description,
                image: article.image,
                name: article.name,
                price: article.price,
                stock: article.stock,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public addArticle = async () => {
        this.cleanRestValidations();

        try {
            await newArticle(this.state);
            this.goHome();
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public delArticle = async () => {
        this.cleanRestValidations();

        try {
            const id = this.state._id;
            if (id) {
                await deleteArticle(id);
                this.goHome();
            }
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public saveImage = async (image: string) => {
        try {
            this.cleanRestValidations();
            if (!image) {
                return;
            }
            const result = await saveImage({
                image,
            });
            this.setState({
                image: result.id,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Detalle del Articulo</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input id="name" type="text"
                            onChange={this.updateState}
                            value={this.state.name}
                            className={this.getErrorClass("name", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("name")} />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <input id="description" type="text"
                            value={this.state.description}
                            onChange={this.updateState}
                            className={this.getErrorClass("description", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("description")} />
                    </div>

                    <div className="form-group">
                        <label>Imagen</label>
                        <ImageUpload
                            src={getPictureUrl(this.state.image)}
                            onChange={this.saveImage} />
                        <ErrorLabel error={this.getErrorText("image")} />
                    </div>

                    <div className="form-group">
                        <label>Precio</label>
                        <input id="price" type="text"
                            value={this.state.price}
                            onChange={this.updateState}
                            className={this.getErrorClass("price", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("price")} />
                    </div>

                    <div className="form-group">
                        <label>Stock</label>
                        <input id="stock" type="text"
                            value={this.state.stock}
                            onChange={this.updateState}
                            className={this.getErrorClass("stock", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("stock")} />
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">
                        {this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.addArticle}>Agregar</button>
                        <button className="btn btn-danger" onClick={this.delArticle} >Eliminar</button >
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >
            </div>
        );
    }
}
