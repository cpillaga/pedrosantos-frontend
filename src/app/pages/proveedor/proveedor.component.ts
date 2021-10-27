import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../models/general.model';
import { ProveedorService } from '../../services/proveedor.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  
  proveedor: Proveedor[] = [];
  provUpd: Proveedor;

  ruc: string = "";
  coincidencia: boolean = true;
  buscarProv = "";
  msgE="";

  tituloImg = "Seleccionar Foto";
  mensajeVal ="";
  
  getData = false;

  estadoBtnAdd = false;

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;

  constructor(
    public _provService: ProveedorService
  ) { }

  ngOnInit(): void {
    this.getProveedor();
  }

  getProveedor(){
    this._provService.getproveedor().subscribe(resp => {
      this.proveedor = resp;
    });
  }

  addProveedor(prov: NgForm){
    if (prov.valid) {
      let existe = false;

      for (let i = 0; i < this.proveedor.length; i++) {
        if (this.proveedor[i].ruc === prov.value.ruc) {
          existe = true;
        }
      }

      if (!existe) {
        this._provService.addProveedor(prov.value).subscribe(resp => {
          this.getProveedor();
          this.closebuttonadd.nativeElement.click();
        }, (err) => {
          console.log(err);
          return;
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Este proveedor ya existe'
        });
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe llenar todos los campos'
      });
    }
  }

  searchProv(termino){
    if (termino == "") {
      this.coincidencia = true;
      this.getProveedor();
    }else{
      this._provService.searchProv(termino).subscribe(resp => {
        if (resp.length === 0) {
          this.coincidencia = false;  
        }else{
          this.proveedor = resp;
          this.coincidencia = true;
        }
      });
    }
  }

  getDataProv(prov: Proveedor){
    this.provUpd = prov;
    console.log(this.provUpd);
    this.getData = true;
  }

  updProveedor(prov){
    if (prov.valid) {
      let existe = false;

      for (let i = 0; i < this.proveedor.length; i++) {
        if (this.proveedor[i]._id != prov.value.id && this.proveedor[i].ruc === prov.value.ruc) {
          existe = true;
        }
      }

      if (!existe) {
        this._provService.updProveedor(prov.value).subscribe(resp => {
          this.getProveedor();
          this.closebuttonupd.nativeElement.click();
        }, (err) => {
          console.log(err);
          return;
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Este proveedor ya existe'
        });
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe llenar todos los campos'
      });
    }
  }
}
