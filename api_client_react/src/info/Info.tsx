import React from "react";
import { useSelector } from "react-redux";
import Form from "../system/components/Form";
import FormLabel from "../system/components/FormLabel";
import FormTitle from "../system/components/FormTitle";
import { IStoredState } from "../system/store/SessionStore";

export default function Info() {
    const user = useSelector((state: IStoredState) => state.user)
    const token = useSelector((state: IStoredState) => state.token)

    return (
        <div>
            <FormTitle>Información de Perfil</FormTitle>

            <Form>
                <FormLabel label="Login" text={user?.login} />
                <FormLabel label="Nombre" text={user?.name} />
                <FormLabel label="Permisos" text={user?.permissions?.join(",")} />
                <FormLabel label="Token" text={token} />
            </Form>
        </div>
    );
}
