import React from "react";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import { getOrders, IOrderList } from "./OrdersApi";

interface IState {
    orders?: IOrderList[];
}

export default class OrdersList extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {};

        this.loadOrders();
    }

    public loadOrders = async () => {
        try {
            const orders = await getOrders();
            this.setState({ orders });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public refresh = () => {
        this.loadOrders();
    }

    public batchPlaced = async () => {
        try {
            await this.batchPlaced();
            this.refresh();
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public batchValidated = async () => {
        try {
            await this.batchValidated();
            this.refresh();
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public batchPaymentDefined = async () => {
        try {
            await this.batchPaymentDefined();
            this.refresh();
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public showOrder = (id: string | undefined) => {
        if (id !== undefined) {
            this.props.history.push("/showOrder/" + id);
        }
    }

    public render() {
        const orders = this.state.orders;
        return (
            <div className="global_content">
                <h2 className="global_title">Ordenes</h2>

                <div hidden={!orders}>
                    <table id="articles" className="table">
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> CartId </th>
                                <th> Estado </th>
                                <th> Precio Total </th>
                                <th> Pago Total </th>
                                <th> Creada </th>
                                <th> Ultima Act. </th>
                                <th> Artículos </th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders ? orders.map((element, i) => {
                                return (
                                    <tr key={i}>
                                        <td> {element.id} </td>
                                        <td> {element.cartId} </td>
                                        <td> {element.status} </td>
                                        <td> {element.totalPrice} </td>
                                        <td> {element.totalPayment} </td>
                                        <td> {element.created} </td>
                                        <td> {element.updated} </td>
                                        <td> {element.articles} </td>
                                        <td>
                                            <a onClick={() => this.showOrder(element.id)} >
                                                <img src="/assets/edit.png" />
                                            </a>
                                        </td>
                                    </tr>
                                );
                            }) : ""
                            }
                        </tbody>
                    </table>
                </div>

                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={this.refresh} >Actualizar</button >
                    <button className="btn btn-primary" onClick={this.batchPlaced} >Batch PLACED</button >
                    <button className="btn btn-primary" onClick={this.batchValidated} >Batch VALIDATED</button >
                    <button className="btn btn-primary" onClick={this.batchPaymentDefined} >
                        Batch PAYMENT_DEFINED
                    </button >
                    <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                </div >

                <div hidden={!this.errorMessage}
                    className="alert alert-danger"
                    role="alert">
                    {this.errorMessage}
                </div>
            </div>
        );
    }
}
