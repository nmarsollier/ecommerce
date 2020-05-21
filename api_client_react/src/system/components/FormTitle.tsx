import React from "react";
import { DefaultProps } from "../utils/Tools";

export default function FormTitle(props: DefaultProps) {
    return (
        <h2 className="global_title">
            {props.children}
        </h2 >
    )
}