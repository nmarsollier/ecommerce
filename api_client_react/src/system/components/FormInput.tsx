import React from "react";
import { ErrorHandler } from "../utils/ErrorHandler";
import ErrorLabel from "./ErrorLabel";

interface FormInputParams {
    label: string,
    name: string,
    errorHandler: ErrorHandler,
    value?: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
}

export default function FormInput(params: FormInputParams) {
    return (
        <div className="form-group">
            <label>{params.label}</label>
            <input id={params.name} type="text"
                value={params.value}
                onChange={params.onChange}
                className={params.errorHandler.getErrorClass(params.name, "form-control")}>
            </input>
            <ErrorLabel message={params.errorHandler.getErrorText(params.name)} />
        </div>
    )
}