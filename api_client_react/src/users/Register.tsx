import React, { useState } from "react";
import "../styles.css";
import { newUser } from "../system/store/SessionStore";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import FormTitle from "../system/components/FormTitle";
import Form from "../system/components/Form";
import FormInput from "../system/components/FormInput";
import FormPassword from "../system/components/FormPassword";
import DangerLabel from "../system/components/DangerLabel";
import FormButtonBar from "../system/components/FormButtonBar";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";

export default function Register(props: DefaultProps) {
    const [login, setLogin] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const errorHandler = useErrorHandler()

    const registerClick = async () => {
        errorHandler.cleanRestValidations();
        if (!login) {
            errorHandler.addError("login", "No puede estar vacío");
        }
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío");
        }
        if (!password) {
            errorHandler.addError("password", "No puede estar vacío");
        }
        if (password !== password2) {
            errorHandler.addError("password2", "Las contraseñas no coinciden");
        }

        if (errorHandler.hasErrors()) {
            return;
        }

        try {
            await newUser({
                login, name, password
            });
            goHome(props);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <FormTitle>Registrar Usuario</FormTitle>

            <Form>
                <FormInput
                    label="Login"
                    name="login"
                    onChange={e => setLogin(e.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Usuario"
                    name="name"
                    onChange={e => setName(e.target.value)}
                    errorHandler={errorHandler} />

                <FormPassword
                    label="Password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    errorHandler={errorHandler} />

                <FormPassword
                    label="Repetir Password"
                    name="password2"
                    onChange={e => setPassword2(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Registrarse" onClick={registerClick} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form>
        </div>
    );
}
