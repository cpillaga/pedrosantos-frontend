import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  title = "";
  mensaje="";
  load = false;

  form1: FormGroup;

  constructor(
    public _product: ProductoService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form1 = this._formBuilder.group({
      title: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  sendNotification(){
    this.load = true;

    this._product.productNotification(this.form1.value).subscribe(resp => {
      if (resp.ok === true) {
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'La notificación fue enviada correctamente'
        });

        this.form1 = this._formBuilder.group({
          title: ['', Validators.required],
          mensaje: ['', Validators.required]
        });

        this.load = false;
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La notificación no fue enviada'
        });
      }
    });
  }
}
