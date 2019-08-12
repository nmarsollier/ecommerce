import { createStore } from "redux";
import * as userApi from "../api/userApi";
import { ILogin, ISignUpRequest, IUser } from "../api/userApi";

export interface IStoredState {
    token?: string;
    user?: IUser;
}

enum StoreAction {
    UPDATE, CLEANUP,
}

interface IAction {
    type: StoreAction;
    payload?: IStoredState;
}

const sessionStore = createStore((state: IStoredState = {}, action: IAction) => {
    switch (action.type) {
        case StoreAction.UPDATE:
            return {
                ...state,
                ...action.payload,
            };
        case StoreAction.CLEANUP:
            return {
                ...state,
                token: undefined,
                user: undefined,
            };
        default:
            return state;
    }
});

export async function login(payload: ILogin): Promise<IUser> {
    try {
        const data = await userApi.login(payload);
        sessionStore.dispatch({
            payload: data,
            type: StoreAction.UPDATE,
        });
        const response = await reloadCurrentUser();
        return Promise.resolve(response);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function newUser(payload: ISignUpRequest): Promise<IUser> {
    try {
        const data = await userApi.newUser(payload);
        sessionStore.dispatch({
            payload: data,
            type: StoreAction.UPDATE,
        });
        const response = await reloadCurrentUser();
        return Promise.resolve(response);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function reloadCurrentUser(): Promise<IUser> {
    try {
        const data = await userApi.reloadCurrentUser();
        sessionStore.dispatch({
            payload: {
                user: data,
            },
            type: StoreAction.UPDATE,
        });
        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function logout(): Promise<void> {
    try {
        if (userApi.getCurrentToken() !== undefined) {
            await userApi.logout();
        }
    } finally {
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.CLEANUP,
        });
    }
    return Promise.resolve();
}

if (userApi.getCurrentToken() !== undefined) {
    sessionStore.dispatch({
        payload: {
            token: userApi.getCurrentToken(),
            user: userApi.getCurrentUser(),
        },
        type: StoreAction.UPDATE,
    });

    reloadCurrentUser().then();
}

export default sessionStore;
