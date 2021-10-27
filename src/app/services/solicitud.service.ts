import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllRequest(){
    let token = localStorage.getItem('tokenHat');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        token
    });

    const url = URL_SERVICE.url + '/solicitud';
    return this.http.get(url, { headers })
        .pipe(map((data: any) => {
          return data.solicitud;
        }));
  }

  
  getDetailRequest(idReq){
    let token = localStorage.getItem('tokenHat');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        token
    });

    const url = URL_SERVICE.url + '/detalleSolicitud/' + idReq;
    return this.http.get(url, { headers })
        .pipe(map((data: any) => {
          return data.detalleSolicitud;
        }));
  }

  atenderSolicitud(id, estado, comentario){
    let token = localStorage.getItem('tokenHat');
    
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/solicitud/' + id;

    let solicitud = {
      status: estado,
      comment: comentario
    }

    return this.http.put( url, solicitud, {headers} )
        .map((resp: any) =>
            resp
        );
  }
}
