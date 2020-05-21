import React from "react";
import ErrorLabel from "./ErrorLabel";
import { ErrorHandler } from "../utils/ErrorHandler";

interface FormPasswordParams {
    label: string,
    name: string,
    errorHandler: ErrorHandler,
    value?: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
}

export default function FormPassword(params: FormPasswordParams) {
    return (
        <div className="form-group">
            <label>{params.label}</label>
            <input id={params.name} type="password"
                value={params.value}
                onChange={params.onChange}
                className={params.errorHandler.getErrorClass(params.name, "form-control")}>
            </input>
            <ErrorLabel message={params.errorHandler.getErrorText(params.name)} />
        </div>
    )
}