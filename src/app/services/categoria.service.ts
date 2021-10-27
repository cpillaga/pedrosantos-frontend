import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private http: HttpClient,
  ) { }

  getCategoria(){

    let token = localStorage.getItem('tokenHat');
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/categoria';

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.categoria
                );
  }

  searchCat(termino: string){
    let token = localStorage.getItem('tokenHat');
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/categoria/buscar/' + termino;

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.categoria
                );
  }

  addCategoria(categoria){
    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/categoria';

    return this.http.post( url, categoria, {headers} )
        .map((resp: any) =>
            resp
        );
  }

  
  async subirImg(img: File){
    const url = "https://api.cloudinary.com/v1_1/http-physeter-net/image/upload?upload_preset=pagd2epm";

    const fd = new FormData();
    fd.append('file', img);

    const resp = await fetch( url, {
        method: 'POST',
        body: fd
    });

    const data = await resp.json();

    return data.secure_url;
  }
  
  updCategoria(categoria){
    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/categoria/' + categoria.id;

    return this.http.put( url, categoria, {headers} )
        .map((resp: any) =>
            resp
        );
  }

}
