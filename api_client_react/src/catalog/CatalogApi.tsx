import axios from "axios";
import { environment } from "../system/environment/environment";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IArticle {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
    stock?: number;
}

export async function getArticle(id: string): Promise<IArticle> {
    try {
        const res = await axios.get(environment.catalogServerUrl + "articles/" + id);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function findArticles(text: string): Promise<IArticle[]> {
    try {
        const res = await axios.get(environment.catalogServerUrl + "articles/search/" + text);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function newArticle(article: IArticle): Promise<IArticle> {
    try {
        const res = await axios.post(environment.catalogServerUrl + "articles", article);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function updateArticle(id: string, article: IArticle): Promise<IArticle> {
    try {
        const res = await axios.post(environment.catalogServerUrl + "articles/" + id, article);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function deleteArticle(id: string): Promise<string> {
    try {
        const res = await axios.delete(environment.catalogServerUrl + "articles/" + id);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}
