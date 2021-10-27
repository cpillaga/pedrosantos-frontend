import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Categoria } from '../../models/general.model';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categorias: Categoria[] = [];
  categoria: Categoria;

  coincidencia: boolean = true;
  descripcion: string = "";
  buscarCat = "";
  
  getData = false;

  public selectImg: File = null;
  public img?: string;
  public nomImg: string;
  public imgTemp: any = null;
  public imgTempAux: any = null;
  
  public estadoBtnAdd = false;

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;


  constructor(
    public _catService: CategoriaService,
    public toastr: ToastrService,
    public router: Router,

  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('tokenHat') == null){
      this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });
    }

    this.getCategorias();
  }

  selectImage(file: File){
    this.selectImg = file;
    this.nomImg = file.name;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  getCategorias(){
    this._catService.getCategoria().subscribe(correcto => {
      this.categorias = correcto;
      this.estadoBtnAdd = false;
    });
  }

  addCategoria(cat: NgForm){
    this.estadoBtnAdd = true;
    if (cat.valid) {
      let existe = false;

      for (let i = 0; i < this.categorias.length; i++) {
        if (this.categorias[i].descripcion === cat.value.descripcion) {
          existe = true;
        }
      }

      if (!existe) {
        this._catService.subirImg(this.imgTemp).then(url => {
          const categoria = {
            descripcion: cat.value.descripcion,
            img: url
          }
          
          this._catService.addCategoria(categoria).subscribe(correcto => {
           
            this.getCategorias();
            this.closebuttonadd.nativeElement.click();
            this.toastr.success('Agregado Correctamente', 'Correcto');
           
          }, (err) => {
            console.log(err);
            return;
          });
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Esta categoría ya existe'
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

  searchCat(termino){
    if (termino == "") {
      this.coincidencia = true;
      this.getCategorias();
    }else{
      this._catService.searchCat(termino).subscribe(resp => {
        if (resp.length === 0) {
          this.coincidencia = false;  
        }else{
          this.categorias = resp;
          this.coincidencia = true;
        }
      });
    }
  }

  getDataCat(cat: Categoria){
    
    this.imgTemp = cat.img;
    this.imgTempAux = this.imgTemp;
    this.categoria = cat;
    this.getData = true;
  }

  updCategoria(cat: NgForm){
    this.estadoBtnAdd = true;
    
    if (this.imgTemp === this.imgTempAux) {
      const categoria = {
        id: cat.value._id,
        descripcion: cat.value.descripcion,
        img: this.imgTemp
      }
      
      this._catService.updCategoria(categoria).subscribe(correcto => {
       
        this.getCategorias();
        this.closebuttonupd.nativeElement.click();
        this.toastr.success('Agregado Correctamente', 'Correcto');
        this.closebuttonupd.nativeElement.click();
      }, (err) => {
        console.log(err);
        return;
      });
    }else{
      this._catService.subirImg(this.imgTemp).then(url => {
        const categoria = {
          id: cat.value._id,
          descripcion: cat.value.descripcion,
          img: url
        }
        
        this._catService.updCategoria(categoria).subscribe(correcto => {
         
          this.getCategorias();
          this.closebuttonupd.nativeElement.click();
          this.toastr.success('Agregado Correctamente', 'Correcto');
         
        }, (err) => {
          console.log(err);
          return;
        });
      });
     

    }
  }
}
