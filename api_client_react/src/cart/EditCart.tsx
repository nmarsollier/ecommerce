import React from "react";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import ErrorLabel from "../system/tools/ErrorLabel";
import { addArticle, decrementArticle, deleteArticle, incrementArticle } from "./CartApi";
import CurrentCart from "./CurrentCart";

interface IState {
    articleId?: string;
    quantity?: number;
}

export default class EditCart extends CommonComponent<ICommonProps, IState> {
    private currentCart = React.createRef<CurrentCart>();

    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            articleId: "",
            quantity: 0,
        };

    }

    public addArticle = async () => {
        try {
            const articleId = this.state.articleId;
            const quantity = this.state.quantity;
            if (!articleId || !quantity) {
                return;
            }

            await addArticle({
                articleId,
                quantity,
            });

            if (this.currentCart.current) {
                this.currentCart.current.refresh();
            }
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public increment = async () => {
        try {
            if (this.state.articleId) {
                await incrementArticle(this.state.articleId);
                if (this.currentCart.current) {
                    this.currentCart.current.refresh();
                }
            }
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public decrement = async () => {
        try {
            if (this.state.articleId) {
                await decrementArticle(this.state.articleId);
                if (this.currentCart.current) {
                    this.currentCart.current.refresh();
                }
            }
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public delete = async () => {
        try {
            if (this.state.articleId) {
                await deleteArticle(this.state.articleId);
                if (this.currentCart.current) {
                    this.currentCart.current.refresh();
                }
            }
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Opciones de Carrito</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Id Artículo</label>
                        <input id="articleId" type="text"
                            onChange={this.updateState}
                            value={this.state.articleId}
                            className={this.getErrorClass("articleId", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("articleId")} />
                    </div>
                    <div className="form-group">
                        <label>Cantidad</label>
                        <input id="quantity" type="text"
                            onChange={this.updateState}
                            value={this.state.quantity}
                            className={this.getErrorClass("quantity", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("quantity")} />
                    </div>
                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.addArticle} >Agregar</button >
                        <button className="btn btn-primary" onClick={this.increment} >Incrementar</button >
                        <button className="btn btn-primary" onClick={this.decrement} >Decrementar</button >
                        <button className="btn btn-danger" onClick={this.delete} >Eliminar</button >
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form>

                <div hidden={!this.errorMessage}
                    className="alert alert-danger"
                    role="alert">
                    {this.errorMessage}
                </div>

                <br />
                <CurrentCart ref={this.currentCart} />
            </div>
        );
    }
}
