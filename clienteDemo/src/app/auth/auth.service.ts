import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { RestBaseService } from '../tools/rest.tools';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService extends RestBaseService {
    public usuarioLogueado: Usuario;

    constructor(private http: Http) {
        super();
    }

    login(username: string, password: string): Promise<Usuario> {
        const data = {
            login: username,
            password: password
        };
        localStorage.removeItem('auth_token');

        return this.http
            .post(
                environment.authServerUrl + 'auth/signin',
                JSON.stringify(data),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                localStorage.setItem('auth_token', response.json().token);
                return this.getPrincipal();
            })
            .catch(this.handleError);
    }

    logout(): Promise<string> {
        return this.http
            .get(environment.authServerUrl + 'auth/signout', this.getRestHeader())
            .toPromise()
            .then(response => {
                localStorage.removeItem('auth_token');
                this.usuarioLogueado = undefined;
                return '';
            }).catch(error => {
                localStorage.removeItem('auth_token');
                this.usuarioLogueado = undefined;
                return this.handleError(error);
            });
    }

    getPrincipal(): Promise<Usuario> {
        if (this.usuarioLogueado) {
            return new Promise((resolve) => {
                resolve(this.usuarioLogueado);
            });
        } else {
            return this.http
                .get(environment.authServerUrl + 'auth/currentUser', this.getRestHeader())
                .toPromise()
                .then(response => {
                    this.usuarioLogueado = response.json();
                    return response.json() as Usuario;
                })
                .catch(this.handleError);
        }
    }

    registrarUsuario(value: RegistrarUsuario): Promise<Usuario> {
        return this.http
            .post(
                environment.authServerUrl + 'auth/signup',
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                localStorage.setItem('auth_token', response.json().token);
                return this.getPrincipal();
            })
            .catch(this.handleError);
    }
}

export interface RegistrarUsuario {
    login: string;
    name: string;
    password: string;
}

export interface Usuario {
    id: string;
    name: string;
    login: string;
    roles: string[];
}
