import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

@Injectable()
export class CatalogService extends RestBaseService {

    constructor(private http: Http) {
        super();
    }

    getArticle(id: string): Promise<Article> {
        return this.http
            .get(
                environment.catalogServerUrl + 'articles/' + id,
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Article;
            })
            .catch(this.handleError);
    }

    findArticles(text: string): Promise<Article[]> {
        return this.http
            .get(
                environment.catalogServerUrl + 'articles/search/' + text,
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Article[];
            })
            .catch(this.handleError);
    }

    newArticle(value: Article): Promise<Article> {
        return this.http
            .post(
                environment.catalogServerUrl + 'articles',
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Article;
            })
            .catch(this.handleError);
    }


    updateArticle(articleId: string, value: Article): Promise<Article> {
        return this.http
            .post(
                environment.catalogServerUrl + 'articles/' + articleId,
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Article;
            })
            .catch(this.handleError);
    }


    deleteArticle(articleId: string): Promise<string> {
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


export interface Article {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
    stock?: number;
}
