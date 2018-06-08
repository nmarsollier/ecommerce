import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

export enum Calidad {
    Q160 = '160',
    Q320 = '320',
    Q640 = '640',
    Q800 = '800',
    Q1024 = '1024',
    Q1200 = '1200',
}

@Injectable()
export class ImageService extends RestBaseService {
    constructor(private http: Http) {
        super();
    }

    getImage(id: string, calidad?: Calidad): Promise<Image> {
        const headers = (calidad) ? this.getRestHeader({ 'Size': calidad }) : this.getRestHeader();

        return this.http
            .get(environment.imageServerUrl + 'image/' + id, headers)
            .toPromise()
            .then(response => {
                return response.json() as Image;
            })
            .catch(this.handleError);
    }

    saveImage(value: Image): Promise<Image> {
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
