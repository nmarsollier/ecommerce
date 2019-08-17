import React from "react";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import { grant, IUser, revoke } from "./UserApi";

interface IState {
    permissions: string;
}

interface IProps extends ICommonProps {
    user: IUser;
    onUpdate: () => any;
    onClose: () => any;
}

export default class UserPermission extends CommonComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            permissions: "",
        };
    }

    public enablePermissions = async () => {
        const perm = this.state.permissions.split(",");
        await grant(this.props.user.id, perm);
        this.props.onUpdate();
    }

    public disablePermissions = async () => {
        const perm = this.state.permissions.split(",");
        await revoke(this.props.user.id, perm);
        this.props.onUpdate();
    }

    public stopEditing = async () => {
        this.props.onClose();
    }

    public render() {
        return (
            <div className="global_content" >
                <h3>Permisos ({this.props.user.login})</h3>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <input id="permissions" type="text"
                            onChange={this.updateState}
                            className={this.getErrorClass("permissions", "form-control")}>
                        </input>
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">{this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.enablePermissions}>Habilitar</button>
                        <button className="btn btn-warning" onClick={this.disablePermissions}>Deshabilitar</button>
                        <button className="btn btn-light" onClick={this.stopEditing}>Cerrar</button>
                    </div >
                </form >
            </div>
        );
    }
}
