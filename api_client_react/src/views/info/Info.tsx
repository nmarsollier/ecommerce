import React from "react";
import { connect } from "react-redux";
import { IUser } from "../../api/userApi";
import { IStoredState } from "../../store/sessionStore";

class StateInfo extends React.Component<IStoredState, any> {
    public render() {
        const user: IUser = this.props.user as IUser;
        const token: string = this.props.token as string;

        return (
            <div>
                <h2>Información de Perfil</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Login</label>
                        <input className="form-control" id="login" value={user.login} disabled />
                    </div>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input className="form-control" id="name" value={user.name} disabled />
                    </div>
                    <div className="form-group">
                        <label>Permisos</label>
                        <input className="form-control" id="name" value={user.permissions} disabled />
                    </div>
                    <div className="form-group">
                        <label>Token</label>
                        <input className="form-control" id="name" value={token} disabled />
                    </div>
                </form>
            </div>
        );
    }
}

const Info = connect(
    (state: IStoredState) => {
        return {
            token: state.token,
            user: state.user,
        };
    })(StateInfo);

export default Info;
