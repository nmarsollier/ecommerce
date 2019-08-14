import React from "react";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import { checkout, getCurrentCart, ICart, ICartValidation, validate } from "./CartApi";

interface IState {
    currentCart?: ICart;
    validation?: ICartValidation;
}

export default class CurrentCart extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {};

        this.loadCurrentCart();
    }

    public loadCurrentCart = async () => {
        try {
            const result = await getCurrentCart();
            this.setState({
                currentCart: result,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public refresh = () => {
        this.loadCurrentCart();
    }

    public validate = async () => {
        try {
            const result = await validate();
            this.setState({
                validation: result,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public checkout = async () => {
        try {
            await checkout();
            this.loadCurrentCart();
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        const cart = this.state.currentCart;
        return (
            <div className="global_content">
                <h2 className="global_title">Carrito Actual</h2>

                <div hidden={!cart}>
                    <div className="form-group">
                        <label>Id Carrito</label>
                        <input className="form-control" id="cartId" value={cart ? cart._id : ""} disabled />
                    </div>

                    <div className="form-group">
                        <label>Id Usuario</label>
                        <input className="form-control" id="userId" value={cart ? cart.userId : ""} disabled />
                    </div>

                    <table id="articles" className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Cantidad</th>
                                <th>Validado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(cart && cart.articles) ?
                                cart.articles!.map((article, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{article.articleId}</td>
                                            <td>{article.quantity}</td>
                                            <td>{article.validated}</td>
                                        </tr>
                                    );

                                }) : null
                            }
                        </tbody>
                    </table>

                    <div className="btn-group ">
                        <button className="btn btn-success" onClick={this.validate} >Validar</button >
                        <button className="btn btn-success" onClick={this.checkout} >Check out</button >
                        <button className="btn btn-success" onClick={this.refresh} >Refresh</button >
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </div>

                <div className="form-group" hidden={!this.state.validation}>
                    <br/>
                    <label>Token</label>
                    <input className="form-control"
                        id="validation"
                        value={JSON.stringify(this.state.validation)}
                        disabled
                    />
                </div>

                <div hidden={!this.errorMessage}
                    className="alert alert-danger"
                    role="alert">
                    {this.errorMessage}
                </div>
            </div>
        );
    }
}
