import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

@Injectable()
export class AuthService extends RestBaseService {
    public usuarioLogueado: User;

    constructor(private http: Http) {
        super();
    }

    login(username: string, password: string): Promise<User> {
        const data = {
            login: username,
            password: password
        };
        localStorage.removeItem('auth_token');

        return this.http
            .post(
                environment.authServerUrl + 'user/signin',
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

    changePassword(currentPassword: string, newPassword: string): Promise<void> {
        const data = {
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        return this.http
            .post(
                environment.authServerUrl + 'user/password',
                JSON.stringify(data),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => null)
            .catch(this.handleError);
    }

    logout(): Promise<string> {
        return this.http
            .get(environment.authServerUrl + 'user/signout', this.getRestHeader())
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

    getPrincipal(): Promise<User> {
        if (this.usuarioLogueado) {
            return new Promise((resolve) => {
                resolve(this.usuarioLogueado);
            });
        } else {
            return this.http
                .get(environment.authServerUrl + 'users/current', this.getRestHeader())
                .toPromise()
                .then(response => {
                    this.usuarioLogueado = response.json();
                    return response.json() as User;
                })
                .catch(this.handleError);
        }
    }

    newUser(value: RegistrarUsuario): Promise<User> {
        return this.http
            .post(
                environment.authServerUrl + 'user',
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

    getUsers(): Promise<User[]> {
        return this.http
            .get(
                environment.authServerUrl + 'users',
                this.getRestHeader()
            )
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    enable(id: string): Promise<void> {
        return this.http
            .post(environment.authServerUrl + 'users/' + id + '/enable', {}, this.getRestHeader())
            .toPromise()
            .then(response => null)
            .catch(this.handleError);
    }

    disable(id: string): Promise<void> {
        return this.http
            .post(environment.authServerUrl + 'users/' + id + '/disable', {}, this.getRestHeader())
            .toPromise()
            .then(response => null)
            .catch(this.handleError);
    }

    grant(id: string, permisos: string[]): Promise<void> {
        const data = {'permissions': permisos};

        return this.http
            .post(environment.authServerUrl + 'users/' + id + '/grant', data, this.getRestHeader())
            .toPromise()
            .then(response => null)
            .catch(this.handleError);
    }

    revoke(id: string, permisos: string[]): Promise<void> {
        const data = {'permissions': permisos};
        return this.http
            .post(environment.authServerUrl + 'users/' + id + '/revoke', data, this.getRestHeader())
            .toPromise()
            .then(response => null)
            .catch(this.handleError);
    }
}

export interface RegistrarUsuario {
    login: string;
    name: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    login: string;
    permissions: string[];
}
