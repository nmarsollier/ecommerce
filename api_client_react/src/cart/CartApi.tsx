import axios, { AxiosError } from "axios";
import { environment } from "../system/environment/environment";
import { logout } from "../system/store/SessionStore";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface ICartValidationItem {
    articleId: string;
    message: string;
}
export interface ICartValidation {
    errors: ICartValidationItem[];
    warnings: ICartValidationItem[];
}

export interface ICart {
    _id: string;
    userId: string;
    orderId?: string;
    enabled: string;
    articles?: IArticle[];
}

export interface IArticle {
    articleId: string;
    quantity: number;
    validated?: boolean;
}

export async function getCurrentCart(): Promise<ICart> {
    try {
        const res = await axios.get(environment.cartServerUrl + "cart");
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function validate(): Promise<ICartValidation> {
    try {
        const res = await axios.get(environment.cartServerUrl + "cart/validate");
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function checkout(): Promise<string> {
    try {
        const res = await axios.post(environment.cartServerUrl + "cart/checkout");
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function addArticle(article: IArticle): Promise<ICart> {
    try {
        const res = await axios.post(environment.cartServerUrl + "cart/article", article);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function incrementArticle(articleId: string): Promise<ICart> {
    try {
        const body: any = {
            articleId,
            quantity: 1,
        };
        const res = await axios.post(environment.cartServerUrl + "cart/article/" + articleId + "/increment", body);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function decrementArticle(articleId: string): Promise<ICart> {
    try {
        const body: any = {
            articleId,
            quantity: 1,
        };
        const res = await axios.post(environment.cartServerUrl + "cart/article/" + articleId + "/decrement", body);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function deleteArticle(articleId: string): Promise<string> {
    try {
        const res = await axios.delete(environment.cartServerUrl + "cart/article/" + articleId);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError).response != null && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}
