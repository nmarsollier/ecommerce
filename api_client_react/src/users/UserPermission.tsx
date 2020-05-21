import React, { useState } from "react";
import "../styles.css";
import { grant, IUser, revoke } from "./UserApi";
import { DefaultProps } from "../system/utils/Tools";
import FormInput from "../system/components/FormInput";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import DangerLabel from "../system/components/DangerLabel";
import FormButtonBar from "../system/components/FormButtonBar";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormWarnButton from "../system/components/FormWarnButton";
import FormButton from "../system/components/FormButton";
import Form from "../system/components/Form";
import FormTitle from "../system/components/FormTitle";

interface UserPermissionProps extends DefaultProps {
    user: IUser;
    onUpdate: () => any;
    onClose: () => any;
}

export default function UserPermission(props: UserPermissionProps) {
    const [permissions, setPermissions] = useState("")
    const errorHandler = useErrorHandler()

    const enablePermissions = async () => {
        const perm = permissions.split(",");
        await grant(props.user.id, perm);
        props.onUpdate();
    }

    const disablePermissions = async () => {
        const perm = permissions.split(",");
        await revoke(props.user.id, perm);
        props.onUpdate();
    }

    const stopEditing = async () => {
        props.onClose();
    }

    return (
        <div className="global_content" >
            <FormTitle>Permisos ({props.user.login})</FormTitle>

            <Form>
                <FormInput
                    label=""
                    name="permissions"
                    onChange={e => setPermissions(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Habilitar" onClick={enablePermissions} />
                    <FormWarnButton label="Deshabilitar" onClick={disablePermissions} />
                    <FormButton label="Cerrar" onClick={stopEditing} />
                </FormButtonBar>
            </Form >
        </div>
    );
}
