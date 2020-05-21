import React, { useState, useEffect } from "react";
import { getOrders, IOrderList, IOrder, batchPlaced, batchValidated, batchPaymentDefined } from "./OrdersApi";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import FormTitle from "../system/components/FormTitle";
import DangerLabel from "../system/components/DangerLabel";
import FormButtonBar from "../system/components/FormButtonBar";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";

export default function OrdersList(props: DefaultProps) {
    const [orders, setOrders] = useState(new Array<IOrderList>())

    const errorHandler = useErrorHandler()

    const loadOrders = async () => {
        try {
            const ordersResult = await getOrders();
            setOrders(ordersResult);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const refresh = () => {
        loadOrders();
    }

    const batchPlacedClick = async () => {
        try {
            await batchPlaced();
            refresh();
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const batchValidatedClick = async () => {
        try {
            await batchValidated();
            refresh();
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const batchPaymentDefinedClick = async () => {
        try {
            await batchPaymentDefined();
            refresh();
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const showOrder = (id?: string) => {
        if (id) {
            props.history.push("/showOrder/" + id);
        }
    }

    useEffect(() => {
        loadOrders()
    }, [])

    return (
        <div className="global_content">
            <FormTitle>Ordenes</FormTitle>

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
                                        <a onClick={() => showOrder(element.id)} >
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

            <FormButtonBar>
                <FormAcceptButton label="Actualizar" onClick={refresh} />
                <FormAcceptButton label="Batch PLACED" onClick={batchPlacedClick} />
                <FormAcceptButton label="Batch VALIDATED" onClick={batchValidatedClick} />
                <FormAcceptButton label="Batch PAYMENT_DEFINED" onClick={batchPaymentDefinedClick} />
                <FormButton label="Cancelar" onClick={() => goHome(props)} />
            </FormButtonBar>

            <DangerLabel message={errorHandler.errorMessage} />
        </div>
    );
}
