import React from "react";
import { DefaultProps } from "../utils/Tools";

export default function FormButtonBar(props: DefaultProps) {
    return (
        <div className="btn-group ">
            {props.children}
        </div >
    )
}