import React from "react";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import OrderDetail from "./OrderDetail";

interface IState {
    text?: string;
    orderId?: string;
}

export default class SearchOrder extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            text: "",
        };
    }

    public componentDidMount() {
        const orderId = this.props.match.params.orderId;
        if (orderId) {
            this.setState({ orderId });
        }
    }

    public search = async () => {
        try {
            this.setState({
                orderId: this.state.text,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content" >
                <h2 className="global_title">Buscar Orden</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Numero Orden</label>
                        <input id="text" type="text"
                            value={this.state.orderId}
                            onChange={this.updateState}
                            className={this.getErrorClass("text", "form-control")}>
                        </input>
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">{this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.search}>Buscar</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >
                <br />
                {this.state.orderId ?
                    <OrderDetail orderId={this.state.orderId} />
                    : ""
                }
            </div>
        );
    }
}
