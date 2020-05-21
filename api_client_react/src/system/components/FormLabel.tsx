import React from "react";

interface FormLabelParams {
    label: string,
    text: string | undefined
}

export default function FormLabel(params: FormLabelParams) {
    return (
        <div className="form-group">
            <label>{params.label}</label>
            <input className="form-control" id="login" value={params.text} disabled />
        </div>
    )
}