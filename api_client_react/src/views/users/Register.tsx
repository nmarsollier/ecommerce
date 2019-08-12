import React from "react";
import { newUser } from "../../store/sessionStore";
import "../../styles.css";
import CommonComponent, { ICommonProps } from "../../tools/CommonComponent";
import ErrorLabel from "../../tools/ErrorLabel";

interface IState {
    login: string;
    name: string;
    password: string;
    password2: string;
}

export default class Register extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            login: "",
            name: "",
            password: "",
            password2: "",
        };
    }

    public registerClick = async () => {
        this.cleanRestValidations();
        if (!this.state.login) {
            this.addError("login", "No puede estar vacío");
        }
        if (!this.state.name) {
            this.addError("name", "No puede estar vacío");
        }
        if (!this.state.password) {
            this.addError("password", "No puede estar vacío");
        }
        if (this.state.password !== this.state.password2) {
            this.addError("password2", "Las contraseñas no coinciden");
        }

        if (this.hasErrors()) {
            this.forceUpdate();
            return;
        }

        try {
            await newUser(this.state);
            this.props.history.push("/");
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Registrar Usuario</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Login</label>
                        <input id="login" type="text"
                            onChange={this.updateState}
                            className={this.getErrorClass("login", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("login")} />
                    </div>

                    <div className="form-group">
                        <label>Usuario</label>
                        <input id="name" type="text"
                            onChange={this.updateState}
                            className={this.getErrorClass("name", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("name")} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input id="password" type="password"
                            onChange={this.updateState}
                            className={this.getErrorClass("password", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("password")} />
                    </div>

                    <div className="form-group">
                        <label>Repetir Password</label>
                        <input id="password2" type="password"
                            onChange={this.updateState}
                            className={this.getErrorClass("password2", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("password2")} />
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">
                        {this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.registerClick}>Registrarse</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >
            </div>
        );
    }
}
