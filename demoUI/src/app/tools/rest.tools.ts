import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';

export class RestBaseService {

  protected handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response && error.status > 0) {
      const body = error.json() || '';
      return Promise.reject(body);
    } else {
      errMsg = error.message ? error.message : error.toString();
      return Promise.reject({ 'error': errMsg });
    }
  }

  protected getRestHeader(): RequestOptions {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }
}
