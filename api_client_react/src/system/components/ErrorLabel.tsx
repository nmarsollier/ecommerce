import React from "react";
import { Z_BLOCK } from "zlib";

interface ErrorLabelProps {
    message: string | undefined;
}

export default function ErrorLabel(props: ErrorLabelProps) {
    if (!props.message) {
        return null
    }

    return (
        <div style={{ display: "block" }} className="invalid-feedback">{props.message}</div>
    );
}
