import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { APP_ROUTES } from './app.routes';
import { PagesModule } from './pages/pages.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from './services/admin.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoriaService } from './services/categoria.service';
import { ProductoService } from './services/producto.service';
import { SubcategoriaService } from './services/subcategoria.service';
import { ProveedorService } from './services/proveedor.service';
import { ImageAddService } from './services/image-add.service';
import { ToastrModule } from 'ngx-toastr';
import { SolicitudService } from './services/solicitud.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    RouterModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    AdminService,
    CategoriaService,
    SubcategoriaService,
    ProveedorService,
    ProductoService,
    ImageAddService,
    SolicitudService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
