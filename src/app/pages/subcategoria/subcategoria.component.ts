import { Component, OnInit, ViewChild } from '@angular/core';
import { Categoria, SubCategoria } from '../../models/general.model';
import { CategoriaService } from '../../services/categoria.service';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrls: ['./subcategoria.component.css']
})
export class SubcategoriaComponent implements OnInit {
  
  categorias: Categoria[] = [];
  subcategorias: SubCategoria[] = [];
  subcategoria: SubCategoria;
  coincidencia: boolean = true;
  descripcion: string = "";
  buscarSubCat = "";
  
  getData = false;
  estadoBtnAdd = false;

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;

  constructor(
    public _catService: CategoriaService,
    public _subCService: SubcategoriaService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getSubCategorias();
    this.getCategorias();
  }

  getSubCategorias(){
    this._subCService.getSubCategoria().subscribe(correcto => {
      this.subcategorias = correcto;
    });
  }

  getCategorias(){
    this._catService.getCategoria().subscribe(correcto => {
      this.categorias = correcto;
    });
  }

  addSubCat(sub: NgForm){
    if (sub.valid) {
      let existe = false;

      for (let i = 0; i < this.subcategorias.length; i++) {
        if (this.subcategorias[i].descripcion === sub.value.descripcion) {
          existe = true;
        }
      }

      if (!existe) {
        const subCategoria = {
          descripcion: sub.value.descripcion,
          categoria: sub.value.categoria
        }
  
        this._subCService.addSubCat(subCategoria).subscribe(resp => {
          this.getSubCategorias();
          this.closebuttonadd.nativeElement.click();
        }, (err) => {
          console.log(err);
          return;
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Esta subcategoría ya existe'
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

  
  searchSubCat(termino){
    if (termino == "") {
      this.coincidencia = true;
      this.getSubCategorias();
    }else{
      this._subCService.searchSubCat(termino).subscribe(resp => {
      
        if (resp.length === 0) {
          this.coincidencia = false;  
        }else{
          this.subcategorias = resp;
          this.coincidencia = true;
        }
      });
    }
  }

  getDataS(subC: SubCategoria){
    this.subcategoria = subC;
    this.getData = true;
  }

  updSubCat(cat: NgForm){
    this.estadoBtnAdd = true;
    let existe = false;

    const subcategoria = {
      id: cat.value.id,
      descripcion: cat.value.descripcion,
      categoria: cat.value.categoria
    }
  
    for (let i = 0; i < this.subcategorias.length; i++) {
      if (this.subcategorias[i]._id != subcategoria.id && this.subcategorias[i].descripcion === subcategoria.descripcion) {
        existe = true;
      }
    }

    if (!existe) {
      this._subCService.updSubCat(subcategoria).subscribe(correcto => {
      
        this.getSubCategorias();
        this.closebuttonupd.nativeElement.click();
        this.closebuttonupd.nativeElement.click();
      }, (err) => {
        console.log(err);
        return;
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Esta subcategoría ya existe'
      });
    }
  }
}
