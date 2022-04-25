import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud, DetalleSolicitud } from '../../models/general.model';
import { SolicitudService } from '../../services/solicitud.service';
import { NgForm } from '@angular/forms';
// import * as moment  from 'moment';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
// import Vector from 'ol/layer/Vector';
import { Vector as Vec } from 'ol/layer';
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { fromLonLat, transform } from 'ol/proj';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {

  request: Solicitud[] = [];
  detailReq: DetalleSolicitud[] = [];
  arrayDR: DetalleSolicitud[] = [];

  reqSelect: Solicitud[] = [];
  selectrequest: Solicitud;

  dataDetalle: boolean = false;

  phone = "";
  // empresa = JSON.parse(localStorage.getItem("empresaBT"));
  // idEmpr = this.empresa['_id'];
  comments: string="";

  btnPendiente: string="activo";
  btnGeneral: string="noActivo"

  estadoSol: boolean = true;

  public estadoBtnAdd = false;


  
  tokenMap = 'pk.eyJ1IjoicGxlbWE3MDQiLCJhIjoiY2p4a2o3cmhzMjRleDN0cDZweWJpeWducyJ9.iLAt8_WcAk6ShXSp6FooEg';
  mapa;
  map;
  center;
  capa;
  source: any;
  point: any;
  marker: any;
  markerVectorLayer: any;
  submitted = false;


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
      if (resp.length > 0) {
        this.request = resp;
        this.obtenerPendiente();
      }
    });
  }
  
  obtenerGeneral(){
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
      
      if (this.selectrequest['delivery'] === true ) {
        this.center = [this.selectrequest['direccion'].lng, this.selectrequest['direccion'].lat ];

        setTimeout(() => {
          this.mapLoad();
        }, 50);
      }else{
        this.dataDetalle = true;
      }
    });
  }

  aceptarSol(){
    
    this._solicitud.atenderSolicitud(this.selectrequest._id, 'Aprobado', 'Solicitud Aprobada').subscribe(resp => {
      this.getRequest();
      this.closebuttonadd.nativeElement.click();
    });

  }
  
  negarSol(forma: NgForm){
    this._solicitud.atenderSolicitud(this.selectrequest._id, 'Negado', forma.value.comments).subscribe(resp => {
      this.getRequest();
      this.closebuttonaden.nativeElement.click();
    }, (err)=> {
      console.log(err);
    });

  }

  
  mapLoad() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${this.tokenMap}`
          })
        })
      ],
      view: new View({
        center: fromLonLat(this.center),
        zoom: 16,
        maxZoom: 17,
        minZoom: 15
      })
    });

    this.crearMarcador();
  }

  crearMarcador(){
    const marcadores = [];
       
    let marcador = new Feature({
      geometry: new Point(
          fromLonLat([this.selectrequest['direccion'].lng, this.selectrequest['direccion'].lat])// En dónde se va a ubicar
      ),
    });
  
    marcador.setStyle(this.iconStyle());
  
    marcadores.push(marcador);
  
    this.capa = new Vec({
        source: new Vector({
            features: marcadores,
        }),
    });
  
    this.map.addLayer(this.capa);
  
    this.dataDetalle = true;
  }
  
  iconStyle() {
    return new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        anchor: [15, 43],
        anchorXUnits: IconAnchorUnits.PIXELS,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: `assets/img/icons/marcador.png`,
      })
    });
  }

  sharedLocation(shared){
    let latitude = "-2.894808884466345";
    let longitude = "-79.00239172542254";
    let ubicacion = `https://www.google.com/maps/dir/${latitude},${longitude}/${this.selectrequest['direccion'].lat},${this.selectrequest['direccion'].lng}`;
    window.location.href = `https://api.whatsapp.com/send?phone=${shared.value.phone}&text=${ubicacion}`; 
  }
}

