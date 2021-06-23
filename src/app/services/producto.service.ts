import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { of } from 'rxjs';

import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://pymesbackend.azurewebsites.net/api/productos/';
    //this.resourceUrl = 'https://localhost:44349/api/articulos/';
  }
 
  get() {
    let params = new HttpParams();

    return this.httpClient.get(this.resourceUrl, { params: params });
  }

  // getById(Id: number) {
  //   return this.httpClient.get(this.resourceUrl + Id);
  // }

  post(obj: Producto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

 
}
