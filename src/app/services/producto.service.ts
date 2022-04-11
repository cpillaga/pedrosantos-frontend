import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private http: HttpClient,
  ) { }

  getProductos(){

    let token = localStorage.getItem('tokenHat');
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/productos';

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp
                );
  }

  
  addProducto(producto){
    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/productos';

    return this.http.post( url, producto, {headers} )
        .map((resp: any) =>
            resp.producto
        );
  }

  searchProd(termino: string){
    let token = localStorage.getItem('tokenHat');
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/productos/buscar/' + termino;

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.productos
                );
  }

  updProducto(producto){
    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/productos/' + producto.id;

    return this.http.put( url, producto, {headers} )
        .map((resp: any) =>
            resp.producto
        );
  }

  productNotification(body){
    let token = localStorage.getItem('tokenHat');
    // productos-promotions/promotions
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/productos-promotions/promotions';

    return this.http.put( url, body, {headers} )
        .map((resp: any) =>
            resp
        );
  }
}
