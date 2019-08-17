import React from "react";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import { Quality } from "./ImageApi";
import ShowImage from "./ShowImage";

interface IState {
    tmpId?: string;
    imageId?: string;
}

export default class SearchPicture extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {
            tmpId: "",
        };
    }

    public searchImage = () => {
        const id = this.state.tmpId;
        if (id) {
            this.setState({
                imageId: id,
                tmpId: id,
            });
        }
    }

    public componentDidMount() {
        const imageId = this.props.match.params.imageId;
        if (imageId) {
            this.setState({ imageId });
        }
    }

    public render() {
        let images;
        if (this.state.imageId) {
            images = (
                <div hidden={!this.state.imageId}>
                    <br />
                    <ShowImage imageId={this.state.imageId} quality={Quality.Q160} jpeg={true} />
                    <ShowImage imageId={this.state.imageId} quality={Quality.Q320} jpeg={true} />
                    <ShowImage imageId={this.state.imageId} quality={Quality.Q640} />
                    <ShowImage imageId={this.state.imageId} quality={Quality.Q800} />
                    <ShowImage imageId={this.state.imageId} quality={Quality.Q1024} />
                    <ShowImage imageId={this.state.imageId} quality={Quality.Q1200} />
                    <ShowImage imageId={this.state.imageId} />
                </div>
            );
        }

        return (
            <div className="global_content" >
                <h2 className="global_title">Buscar Imagen</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Id Imagen</label>
                        <input id="tmpId" type="text"
                            value={this.state.imageId}
                            onChange={this.updateState}
                            className={this.getErrorClass("tmpId", "form-control")}>
                        </input>
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">{this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.searchImage}>Buscar</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >

                    {images}
                </form >
            </div>
        );
    }
}
