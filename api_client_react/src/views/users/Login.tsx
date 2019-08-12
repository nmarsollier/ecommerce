import React from "react";
import { login } from "../../store/sessionStore";
import "../../styles.css";
import CommonComponent, { ICommonProps } from "../../tools/CommonComponent";
import ErrorLabel from "../../tools/ErrorLabel";

interface IState {
    login: string;
    password: string;
}

export default class Login extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            login: "",
            password: "",
        };
    }

    public loginClick = async () => {
        this.cleanRestValidations();
        if (!this.state.login) {
            this.addError("login", "No puede estar vacío");
        }
        if (!this.state.password) {
            this.addError("password", "No puede estar vacío");
        }

        if (this.hasErrors()) {
            this.forceUpdate();
            return;
        }

        try {
            await login(this.state);
            this.props.history.push("/");
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Login</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input id="login" type="text"
                            onChange={this.updateState}
                            className={this.getErrorClass("login", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("login")} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input id="password" type="password"
                            onChange={this.updateState}
                            className={this.getErrorClass("password", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("password")} />
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">
                        {this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.loginClick}>Login</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >
            </div >
        );
    }
}
