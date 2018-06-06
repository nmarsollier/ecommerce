import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { RestBaseService } from '../tools/rest.tools';
import { environment } from '../../environments/environment';

@Injectable()
export class ImageService extends RestBaseService {
    constructor(private http: Http) {
        super();
    }

    buscarImagen(id: string): Promise<Image> {
        return this.http
            .get(environment.imageServerUrl + 'image/' + id, this.getRestHeader())
            .toPromise()
            .then(response => {
                return response.json() as Image;
            })
            .catch(this.handleError);
    }

    guardarImagen(value: Image): Promise<Image> {
        return this.http
            .post(
                environment.imageServerUrl + 'image/',
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Image;
            })
            .catch(this.handleError);
    }
}

export interface Image {
    id?: string;
    image: string;
}
