import React from "react";
import "../styles.css";
import CommonComponent, { ICommonProps } from "../system/tools/CommonComponent";
import ErrorLabel from "../system/tools/ErrorLabel";
import ImageUpload from "../system/tools/ImageUpload";
import { getPictureUrl, saveImage } from "./ImageApi";

interface IState {
    imageId?: string;
    image?: string;
}

export default class UploadPicture extends CommonComponent<ICommonProps, IState> {
    constructor(props: ICommonProps) {
        super(props);

        this.state = {};
    }

    public updateImageState = (image: string) => {
        this.setState({
            image,
        });
    }

    public saveImage = async () => {
        try {
            this.cleanRestValidations();
            const image = this.state.image;
            if (!image) {
                return;
            }
            const result = await saveImage({
                image,
            });
            this.setState({
                imageId: result.id,
            });
        } catch (error) {
            this.processRestValidations(error);
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Agregar Imagen</h2>

                <form onSubmit={(e) => e.preventDefault()}>

                    <div className="form-group">
                        <ImageUpload src={getPictureUrl(this.state.image)}
                            onChange={this.updateImageState} />
                        <ErrorLabel error={this.getErrorText("name")} />
                    </div>

                    <div className="form-group" hidden={!this.state.imageId}>
                        <label>Id Imagen</label>
                        <input className="form-control" id="imageId" value={this.state.imageId} disabled />
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">{this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button
                            className="btn btn-primary"
                            onClick={this.saveImage}
                            hidden={this.state.imageId !== undefined}>Subir</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >
            </div>
        );
    }
}
