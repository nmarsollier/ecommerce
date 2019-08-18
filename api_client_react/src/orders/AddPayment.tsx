import React from "react";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import ErrorLabel from "../system/tools/ErrorLabel";
import { addPayment, IPayment } from "./OrdersApi";

interface IState {
    method: string;
    amount: number;
}

interface IAddPaymentProps extends ICommonProps {
    orderId: string;
    payment: IPayment;
    onPaymentAdded: () => (void);
}

export default class AddPayment extends CommonComponent<IAddPaymentProps, IState> {
    constructor(props: IAddPaymentProps) {
        super(props);

        this.state = {
            amount: this.props.payment.amount,
            method: this.props.payment.method,
        };
    }

    public addPayment = async () => {
        this.cleanRestValidations();

        try {
            await addPayment(this.props.orderId, this.state.method, this.state.amount);
            this.props.onPaymentAdded();
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Agregar Articulo</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Method</label>

                        <select id="method"
                            onChange={this.onSelectChange}
                            className={this.getErrorClass("method", "form-control")}>
                            >
                            <option value="CASH">CASH</option>
                            <option value="CREDIT">CREDIT</option>
                            <option value="DEBIT">DEBIT</option>
                        </select>
                        <ErrorLabel error={this.getErrorText("method")} />
                    </div>

                    <div className="form-group">
                        <label>Importe</label>
                        <input id="amount" type="text"
                            onChange={this.onInputChange}
                            className={this.getErrorClass("amount", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("amount")} />
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">
                        {this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.addPayment}>Agregar</button>
                        <button className="btn btn-light" onClick={this.props.onPaymentAdded} >Cancelar</button >
                    </div >
                </form >
            </div>
        );
    }
}
