import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IProfile {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    picture: string;
}

export interface IUpdateBasicProfile {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
}

export async function updateBasicInfo(data: IUpdateBasicProfile): Promise<IProfile> {
    try {
        const res = await axios.post("http://localhost:3000/v1/profile", data);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export interface IUpdateProfileImage {
    image: string;
}
export interface IUpdateProfileImageId {
    id: string;
}

export async function updateProfilePicture(payload: IUpdateProfileImage): Promise<IUpdateProfileImageId> {
    try {
        const res = await axios.post("http://localhost:3000/v1/profile/picture", payload);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function getCurrentProfile(): Promise<IProfile> {
    try {
        const res = await axios.get("http://localhost:3000/v1/profile");
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export function getPictureUrl(id: string | undefined) {
    if (id && id.length > 0) {
        return "http://localhost:3000/v1/image/" + id;
    } else {
        return "/assets/profile.png";
    }
}
