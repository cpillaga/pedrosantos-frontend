import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PAGES_ROUTES } from './pages.routes';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ProductoComponent } from './producto/producto.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { SubcategoriaComponent } from './subcategoria/subcategoria.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { PromocionesComponent } from './promociones/promociones.component';


@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    ProductoComponent,
    CategoriaComponent,
    SubcategoriaComponent,
    ProveedorComponent,
    SolicitudesComponent,
    PromocionesComponent,
  ],
  exports: [
      PagesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class PagesModule { }
