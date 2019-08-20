import React from "react";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import AddPayment from "./AddPayment";
import { getOrder, IOrder, IPayment } from "./OrdersApi";

interface IState {
    order?: IOrder;
    payment?: IPayment;
}

interface IOrderDetailProps extends ICommonProps {
    orderId: string;
}

export default class OrderDetail extends CommonComponent<IOrderDetailProps, IState> {
    constructor(props: IOrderDetailProps) {
        super(props);

        this.state = {};

        this.loadOrder();
    }

    public cancelPayment = () => {
        this.setState({ payment: undefined });
        this.loadOrder();
    }

    public loadOrder = async () => {
        try {
            const order = await getOrder(this.props.orderId);
            this.setState({ order });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public addPayment = () => {
        try {
            this.setState(
                {
                    payment: {
                        amount: 0,
                        method: "",
                    },
                });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        const order = this.state.order;
        return order ? (
            <div className="global_content">
                <h2 className="global_title">Detalle de Orden : {order.id}</h2>

                <div>
                    <div className="form-group">
                        <label>Cart Id</label>
                        <input value={order.cartId} disabled />
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <input value={order.status} disabled />
                    </div>
                    <div className="form-group">
                        <label>Importe Total</label>
                        <input value={order.totalPrice} disabled />
                    </div>
                    <div className="form-group">
                        <label>Pago Total</label>
                        <input value={order.totalPayment} disabled />
                    </div>
                    <div className="form-group">
                        <label>Creada</label>
                        <input value={order.created} disabled />
                    </div>
                    <div className="form-group">
                        <label>Actualizada</label>
                        <input value={order.updated} disabled />
                    </div>
                </div>

                <table id="articles" className="table">
                    <thead>
                        <tr>
                            <th> Id </th>
                            <th> Cantidad </th>
                            <th> Precio Unit. </th>
                            <th> Valido </th>
                            <th> Validado </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order && order.articles) ?
                            order.articles!.map((article, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{article.id}</td>
                                        <td>{article.quantity}</td>
                                        <td>{article.unitaryPrice}</td>
                                        <td>{article.valid}</td>
                                        <td>{article.validated}</td>
                                    </tr>
                                );

                            }) : null
                        }
                    </tbody>
                </table>

                <br />
                <h4>Pagos</h4>
                <table>
                    <thead>
                        <tr>
                            <th> Método </th>
                            <th> Import </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order && order.payment) ?
                            order.payment!.map((pay, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{pay.method}</td>
                                        <td>{pay.amount}</td>
                                    </tr>
                                );
                            }) : null
                        }
                    </tbody>
                </table>

                <br />
                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={this.addPayment} >Agregar Pago</button >
                    <button className="btn btn-primary" onClick={this.loadOrder} >Actualizar</button >
                </div >
                <br />
                {(this.state.payment) ?
                    <AddPayment
                        orderId={this.state.order!.id}
                        payment={this.state.payment!}
                        onPaymentAdded={this.cancelPayment} />
                    : ""
                }
            </div>
        ) : "";
    }
}
