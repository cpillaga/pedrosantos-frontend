import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud, DetalleSolicitud } from '../../models/general.model';
import { SolicitudService } from '../../services/solicitud.service';
import { NgForm } from '@angular/forms';
import * as moment  from 'moment';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  request: Solicitud[] = [];
  detailReq: DetalleSolicitud[] = [];
  arrayDR: DetalleSolicitud[] = [];

  reqSelect: Solicitud[] = [];
  selectrequest: Solicitud;

  dataDetalle: boolean = false;

  // empresa = JSON.parse(localStorage.getItem("empresaBT"));
  // idEmpr = this.empresa['_id'];
  comments: string="";

  btnPendiente: string="activo";
  btnGeneral: string="noActivo"

  estadoSol: boolean = true;

  public estadoBtnAdd = false;

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonaden',  {static: false}) closebuttonaden;
  
  constructor(
    public _solicitud: SolicitudService, 
  ) { }

  ngOnInit(): void {
    this.getRequest();
  }

  
  getRequest(){
    this.arrayDR = [];
    this.request = [];
    this.detailReq = null;

    this._solicitud.getAllRequest().subscribe(resp => {
      console.log(resp);
      if (resp.length > 0) {
        this.request = resp;
        this.obtenerPendiente();
      }
    });
  }
  
  obtenerGeneral(){
    console.log("Entro general");
    this.reqSelect = [];
    let cont = 0;
    
    this.btnPendiente = "noActivo";
    this.btnGeneral = "activo"
  
    this.estadoSol = true;
    for (let i = 0; i < this.request.length; i++) {
      if (this.request[i]['estado'] != 'Pendiente') {
        this.reqSelect[cont] = this.request[i];
        cont = cont + 1;
      }
    }
  }

  obtenerPendiente(){
    console.log("Entro pendiente");
    this.reqSelect = [];
    let cont = 0;
    
    this.estadoSol = false;
    this.btnPendiente = "activo";
    this.btnGeneral = "noActivo"

    for (let i = 0; i < this.request.length; i++) {
      if (this.request[i]['estado'] === 'Pendiente') {
        this.reqSelect[cont] = this.request[i];
        cont = cont + 1;
      }
    }
  }

  getDetalle(request){
    this.detailReq = [];
    
    this.selectrequest = request;
    
    this._solicitud.getDetailRequest(this.selectrequest._id).subscribe(resp => {
      this.detailReq = resp;
      this.dataDetalle = true;
    });
  }

  aceptarSol(){
    // const fecha = moment().format('YYYY-MM-DD');
    // const hora = moment().format('HH:mm:ss');
  
    // const dateA = fecha+"T"+hora+".182Z";

    this._solicitud.atenderSolicitud(this.selectrequest._id, 'Aprobado', 'Solicitud Aprobada').subscribe(resp => {
      this.getRequest();
      this.closebuttonadd.nativeElement.click();
    });

  }

  
  negarSol(forma: NgForm){
    // const fecha = moment().format('YYYY-MM-DD');
    // const hora = moment().format('HH:mm:ss');
  
    // const dateA = fecha+"T"+hora+".182Z";

    this._solicitud.atenderSolicitud(this.selectrequest._id, 'Negado', forma.value.comments).subscribe(resp => {
      this.getRequest();
      this.closebuttonaden.nativeElement.click();
    }, (err)=> {
      console.log(err);
    });

  }
}

