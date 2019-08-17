import React from "react";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import { disableUser, enableUser, getUsers, IUser } from "./UserApi";
import UserPermission from "./UserPermission";

interface IState {
    users: IUser[];
    editUser?: IUser;
}

export default class UserList extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            users: [],
        };
    }

    public componentDidMount() {
        this.loadUsers();
    }

    public loadUsers = async () => {
        try {
            const result = await getUsers();
            this.setState({
                users: result,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public editPermissionsClick = (user: IUser | undefined) => {
        this.setState({
            editUser: user,
        });
    }

    public enableUser = async (user: IUser) => {
        await enableUser(user.id);
        this.loadUsers();
    }

    public disableUser = async (user: IUser) => {
        await disableUser(user.id);
        this.loadUsers();
    }

    public render() {
        let permEdit;
        if (this.state.editUser) {
            permEdit = <UserPermission
                user={this.state.editUser}
                onUpdate={this.loadUsers}
                onClose={() => this.editPermissionsClick(undefined)} />;
        }

        return (
            <div className="global_content">
                <h2 className="global_title">Users</h2>
                <table id="users" className="table">
                    <thead>
                        <tr>
                            <th> Id </th>
                            <th> Login </th>
                            <th> Nombre </th>
                            <th> Permisos </th>
                            <th> Habilitado </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user, i) => {
                            return (
                                <tr key={i}>
                                    <td>{user.id}</td>
                                    <td>{user.login}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        {user.permissions.join(", ")}
                                        <a hidden={!user.enabled}
                                            onClick={() => this.editPermissionsClick(user)}>
                                            <img src="/assets/edit.png" />
                                        </a>
                                    </td>
                                    <td>
                                        <a hidden={!user.enabled}
                                            onClick={() => this.disableUser(user)}>
                                            <img src="/assets/enable.png" />
                                        </a>
                                        <a hidden={user.enabled}
                                            onClick={() => this.enableUser(user)}>
                                            <img src="/assets/disable.png" />
                                        </a>
                                        {user.enabled ? "Deshabilitar" : "Habilitar"}&nbsp;
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {permEdit}

                <div className="btn-group ">
                    <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                </div >
            </div>
        );
    }
}
