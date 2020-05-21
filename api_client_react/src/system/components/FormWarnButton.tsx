import React from "react";

interface FormWarnButtonProps {
    label: string,
    hidden?: boolean,
    onClick: () => any
}

export default function FormWarnButton(props: FormWarnButtonProps) {
    return (
        <button hidden={(props.hidden === true) ? true : false} className="btn btn-warning" onClick={props.onClick}>{props.label}</button>
    )
}
