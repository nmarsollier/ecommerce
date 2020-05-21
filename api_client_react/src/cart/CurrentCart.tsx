import React, { useEffect, useState } from "react";
import DangerLabel from "../system/components/DangerLabel";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormLabel from "../system/components/FormLabel";
import FormTitle from "../system/components/FormTitle";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { checkout, getCurrentCart, ICart, ICartValidation, validate } from "./CartApi";

export default function CurrentCart(props: DefaultProps) {
    const [currentCart, setCurrentCart] = useState<ICart>()
    const [validation, setValidation] = useState<ICartValidation | undefined>()

    const errorHandler = useErrorHandler()

    const loadCurrentCart = async () => {
        try {
            const result = await getCurrentCart();
            setCurrentCart(result);

        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const refresh = () => {
        loadCurrentCart();
    }

    const onValidate = async () => {
        try {
            const result = await validate();
            setValidation(result);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const onCheckout = async () => {
        try {
            await checkout();
            loadCurrentCart();
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    useEffect(() => {
        loadCurrentCart()
    }, [])

    return (
        <div className="global_content">
            <FormTitle>Carrito Actual</FormTitle>

            <CurrentCartDetails
                cart={currentCart}
                onValidate={onValidate}
                onCheckout={onCheckout}
                onRefresh={refresh}
            />

            <br />

            <FormLabel label="Validación" text={JSON.stringify(validation)} />

            <DangerLabel message={errorHandler.errorMessage} />
        </div>
    );

}


interface CurrentCartDetailsProps extends DefaultProps {
    cart?: ICart,
    onValidate: () => any,
    onCheckout: () => any,
    onRefresh: () => any
}

function CurrentCartDetails(props: CurrentCartDetailsProps) {
    if (!props.cart) {
        return null
    }

    return (
        <div className="global_content">
            <div>
                <FormLabel label="Id Carrito" text={props.cart._id} />
                <FormLabel label="Id Usuario" text={props.cart.userId} />

                <table id="articles" className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Cantidad</th>
                            <th>Validado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.cart.articles?.map((article, i) => {
                            return (
                                <tr key={i}>
                                    <td>{article.articleId}</td>
                                    <td>{article.quantity}</td>
                                    <td>{article.validated}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <FormButtonBar>
                    <FormAcceptButton label="Validar" onClick={props.onValidate} />
                    <FormAcceptButton label="Checkout" onClick={props.onCheckout} />
                    <FormAcceptButton label="Refresh" onClick={props.onRefresh} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </div>
        </div>
    );
}
