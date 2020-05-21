import { useState } from "react";

export interface DefaultProps {
    history?: any;
    match?: any;
    children?: any;
}

export function goHome(props: DefaultProps) {
    if (props.history) {
        props.history.push("/");
    }
}

export function useForceUpdate() {
    const setForceUpdate = useState(0)[1]

    return () => {
        setForceUpdate(Date.now)
    }
}
