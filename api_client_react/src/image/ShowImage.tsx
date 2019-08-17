import React from "react";
import "../styles.css";
import { ICommonProps } from "../system/tools/CommonComponent";
import { getImage, IImage, Quality } from "./ImageApi";

export interface IShowImageProps extends ICommonProps {
    imageId?: string;
    quality?: Quality;
    jpeg?: boolean;
}

interface IState {
    image?: IImage;
}

export default class ShowImage extends React.Component<IShowImageProps, IState> {
    constructor(props: IShowImageProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.fetchImage();
    }

    public render() {
        return (
            <div hidden={!this.props.imageId} >
                <img src={this.state.image ? this.state.image.image : ""} />
                <div className="text-block">
                    <strong>{this.props.quality ? this.props.quality : "Original"}</strong>
                </div>
            </div>
        );
    }

    public fetchImage = async () => {
        if (this.props.imageId !== undefined) {
            const img = await getImage(this.props.imageId, this.props.quality, this.props.jpeg);
            this.setState({
                image: img,
            });
        }
    }
}
