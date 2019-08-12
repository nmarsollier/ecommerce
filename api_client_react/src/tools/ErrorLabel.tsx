import React from "react";

interface IProps {
    error: string | undefined;
}

export default class ErrorLabel extends React.Component<IProps, any> {
    public render() {
        return (
            <div hidden={!this.props.error} className="invalid-feedback">{this.props.error}</div>
        );
    }
}
