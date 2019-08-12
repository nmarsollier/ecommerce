import React from "react";

interface IProps {
    src: string;
    onChange: (image: string) => void;
}

export default class ImageUpload extends React.Component<IProps, any> {
    public imageClick = () => {
        const fileInput: HTMLInputElement | null = (this.refs.fileInput as HTMLInputElement);
        if (fileInput == null) {
            return;
        }
        fileInput.click();
    }

    public imageSelect = () => {
        const fileInput: HTMLInputElement | null = (this.refs.fileInput as HTMLInputElement);
        if (fileInput == null) {
            return;
        }
        this.getBase64(
            (fileInput.files as FileList)[0],
            (image) => {
                if (image && this.props.onChange) {
                    this.props.onChange(image);
                }
            });
    }

    public render() {
        return (
            <div>
                <img src={this.props.src}
                    alt=""
                    height="100"
                    onClick={this.imageClick} />
                <input type="file"
                    ref="fileInput"
                    className="upload"
                    accept="*"
                    onChange={this.imageSelect}
                    style={{ display: "none" }} />
            </div>
        );
    }

    private getBase64(file: File, cb: (image: string) => void) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            cb(reader.result as string);
        };
    }
}
