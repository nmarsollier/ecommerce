import React from "react";

interface DangerLabelProps {
    message: string | undefined;
}

export default function DangerLabel(props: DangerLabelProps) {
    if (!props.message) {
        return null
    }
    return (
        <div className="alert alert-danger" role="alert">
            {props.message}
        </div>
    )
}