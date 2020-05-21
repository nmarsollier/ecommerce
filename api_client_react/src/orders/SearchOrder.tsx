import React, { useState, useEffect } from "react";
import "../styles.css";
import OrderDetail from "./OrderDetail";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import FormTitle from "../system/components/FormTitle";
import FormInput from "../system/components/FormInput";
import Form from "../system/components/Form";
import DangerLabel from "../system/components/DangerLabel";
import FormButtonBar from "../system/components/FormButtonBar";
import FormButton from "../system/components/FormButton";
import FormAcceptButton from "../system/components/FormAcceptButton";

interface IState {
    text?: string;
    orderId?: string;
}

export default function SearchOrder(props: DefaultProps) {
    const [text, setText] = useState("")
    const [orderId, setOrderId] = useState<string>()

    const errorHandler = useErrorHandler()

    const search = () => {
        try {
            setOrderId(text);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    useEffect(() => {
        const id = props.match.params.orderId;
        if (id) {
            setOrderId(id);
        }
    }, [])

    return (
        <div className="global_content" >
            <FormTitle>Buscar Orden</FormTitle>

            <Form>
                <FormInput
                    label="Numero Orden"
                    name="text"
                    value={orderId}
                    onChange={e => setText(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Buscar" onClick={search} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form>

            <br />

            <OrderDetail orderId={orderId} />
        </div>
    );
}
