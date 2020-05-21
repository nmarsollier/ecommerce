import React, { useEffect, useState } from "react";
import "../styles.css";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormTitle from "../system/components/FormTitle";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps, goHome } from "../system/utils/Tools";
import { disableUser, enableUser, getUsers, IUser } from "./UserApi";
import UserPermission from "./UserPermission";

export default function UserList(props: DefaultProps) {
    const [users, setUsers] = useState(Array<IUser>())
    const [editUser, setEditUser] = useState<IUser | undefined>()

    const errorHandler = useErrorHandler()

    const loadUsers = async () => {
        try {
            const result = await getUsers();
            setUsers(result);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const editPermissionsClick = (user?: IUser) => {
        setEditUser(user);
    }

    const enableThisUser = async (user: IUser) => {
        await enableUser(user.id);
        loadUsers();
    }

    const disableThisUser = async (user: IUser) => {
        await disableUser(user.id);
        loadUsers();
    }

    useEffect(() => {
        loadUsers()
    }, [])


    let permEdit;
    if (editUser) {
        permEdit = <UserPermission
            user={editUser}
            onUpdate={loadUsers}
            onClose={editPermissionsClick} />;
    }

    return (
        <div className="global_content">
            <FormTitle>Users</FormTitle>

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
                    {users.map((user, i) => {
                        return (
                            <tr key={i}>
                                <td>{user.id}</td>
                                <td>{user.login}</td>
                                <td>{user.name}</td>
                                <td>
                                    {user.permissions.join(", ")}
                                    <a hidden={!user.enabled}
                                        onClick={() => editPermissionsClick(user)}>
                                        <img src="/assets/edit.png" />
                                    </a>
                                </td>
                                <td>
                                    <a hidden={!user.enabled}
                                        onClick={() => disableThisUser(user)}>
                                        <img src="/assets/enable.png" />
                                    </a>
                                    <a hidden={user.enabled}
                                        onClick={() => enableThisUser(user)}>
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

            <FormButtonBar>
                <FormButton onClick={() => goHome(props)} label="Cancelar" />
            </FormButtonBar>
        </div>
    );
}
