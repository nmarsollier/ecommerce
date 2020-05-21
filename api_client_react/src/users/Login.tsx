import React, { useState } from "react";
import "../styles.css";
import { login } from "../system/store/SessionStore";
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


export default function Login(props: DefaultProps) {
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const errorHandler = useErrorHandler()

    const loginClick = async () => {
        errorHandler.cleanRestValidations();
        if (!login) {
            errorHandler.addError("login", "No puede estar vacío");
        }
        if (!password) {
            errorHandler.addError("password", "No puede estar vacío");
        }

        if (errorHandler.hasErrors()) {
            return;
        }

        try {
            await login({ login: userName, password });
            props.history.push("/");
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <FormTitle>Login</FormTitle>

            <Form>
                <FormInput
                    label="Usuario"
                    name="login"
                    onChange={e => setUsername(e.target.value)}
                    errorHandler={errorHandler} />

                <FormPassword
                    label="Password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Login" onClick={loginClick} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form>
        </div >
    );
}
