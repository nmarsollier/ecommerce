import axios from "axios";
import { environment } from "../system/environment/environment";

axios.defaults.headers.common["Content-Type"] = "application/json";

export enum Quality {
    Q160 = "160",
    Q320 = "320",
    Q640 = "640",
    Q800 = "800",
    Q1024 = "1024",
    Q1200 = "1200",
}

export interface IImage {
    id?: string;
    image: string;
}

export async function getImage(id: string, quality?: Quality, jpeg: boolean = false): Promise<IImage> {
    try {
        const headers = quality ? {
            headers: {
                Size: quality,
            },
        } : undefined;

        const url = environment.imageServerUrl + "image/" + id;
        if (jpeg) {
            return Promise.resolve({
                image: url + "/jpeg?Size=" + quality,
            });
        }

        const res = await axios.get(url, headers);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function saveImage(value: IImage): Promise<IImage> {
    try {
        const res = await axios.post(environment.imageServerUrl + "image", value);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export function getPictureUrl(id: string | undefined) {
    if (id && id.length > 0) {
        if (id.length > 100) {
            return id;
        } else {
            return environment.imageServerUrl + "image/" + id + "/jpeg?Size=160";
        }
    } else {
        return "/assets/select_image.png";
    }
}
