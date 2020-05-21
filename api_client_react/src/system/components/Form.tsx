import React from "react";
import { DefaultProps } from "../utils/Tools";

export default function Form(props: DefaultProps) {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            {props.children}
        </form >
    )
}