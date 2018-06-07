import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { RestBaseService } from '../tools/rest.tools';
import { environment } from '../../environments/environment';

@Injectable()
export class CatalogService extends RestBaseService {

    constructor(private http: Http) {
        super();
    }

    buscarArticulo(id: string): Promise<Articulo> {
        return this.http
            .get(
                environment.catalogServerUrl + 'articles/' + id,
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Articulo;
            })
            .catch(this.handleError);
    }

    buscarArticulos(text: string): Promise<Articulo[]> {
        return this.http
            .get(
                environment.catalogServerUrl + 'articles/search/' + text,
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Articulo[];
            })
            .catch(this.handleError);
    }

    nuevoArticulo(value: Articulo): Promise<Articulo> {
        return this.http
            .post(
                environment.catalogServerUrl + 'articles',
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Articulo;
            })
            .catch(this.handleError);
    }


    actualizarArticulo(articleId: string, value: Articulo): Promise<Articulo> {
        return this.http
            .post(
                environment.catalogServerUrl + 'articles/' + articleId,
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Articulo;
            })
            .catch(this.handleError);
    }


    eliminarArticulo(articleId: string): Promise<string> {
        return this.http
            .delete(
                environment.catalogServerUrl + 'articles/' + articleId,
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return '';
            })
            .catch(this.handleError);
    }
}


export interface Articulo {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
    stock?: number;
}
