import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ImageAddService {

  constructor(
    private http: HttpClient,
  ) { }

  getimgAdd(idP){

    let token = localStorage.getItem('tokenHat');

    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/imagenAdd/' + idP;

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.imagenAdd
                );
  }

  addImgAdd(imagenAdd){
    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/imagenAdd';

    return this.http.post( url, imagenAdd, {headers} )
        .map((resp: any) =>
            resp
        );
  }


  eliminarImg(idImg){
    // /imagenAdd/:idImg

    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/imagenAdd/' + idImg;

    return this.http.delete( url, {headers} )
        .map((resp: any) =>
            resp
        );
  }
}
