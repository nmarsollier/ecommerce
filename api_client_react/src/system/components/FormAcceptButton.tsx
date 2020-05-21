import React from "react";

interface FormAcceptButtonProps {
    label: string,
    hidden?: boolean,
    onClick: () => any
}

export default function FormAcceptButton(props: FormAcceptButtonProps) {
    return (
        <button hidden={(props.hidden === true) ? true : false} className="btn btn-primary" onClick={props.onClick}>{props.label}</button>
    )
}
