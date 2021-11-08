import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';
import { CategoriaService } from '../../services/categoria.service';
import { ImageAddService } from '../../services/image-add.service';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { Router } from '@angular/router';
import { Categoria, SubCategoria, Proveedor, Producto } from '../../models/general.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  producto: Producto;
  idProducto: string;
  coincidencia: boolean = true;
  ruc: string = "";
  buscarEmp = "";
  msgE="";
  provNom = "";
  idProv = "";
  subCNom = "";
  idSubC = "";
  catNom = "";
  idCat = "";
  getImg = false;
  imgAdicionales = [];
  
  selectId = "";
  selectProdImg;

  conteoAdd = 0;

  tituloImg = "Seleccionar Foto";
  mensajeVal ="";

  orderRS = "asc";
  orderES = "asc";

  getData = false;
  validarImg = true;
  contImg = 0;
  contImgA = 0;

  profileForm = this.fb.group({
    nombre: ['', Validators.required],
    unidadMedida: ['', Validators.required],
    stock: ['', Validators.required],
    precioUni: ['', Validators.required],
    categoria: ['', Validators.required],
    proveedor: ['', Validators.required],
    subcategoria: ['', Validators.required],
    imgProdAdd: this.fb.array([
      this.fb.control('')
    ])
  });
  
  public selectImg: File = null;
  public img?: string;
  public nomImg: string;
  public imgTemp: any = null;
  public imgAdds: any[] = [];
  public imgTempAux: any = null;
  
  numPage: Number;
  paginas: Number[] = [];
  categorias: Categoria[] = [];
  categoria: Categoria;
  subcategorias: SubCategoria[] = [];
  subcategoria: SubCategoria;
  proveedores: Proveedor[] = [];

  pagActive: string[] = [];

  cambioCat = false;
  estadoBtnAdd = false;

  habilitarPre = 'disabled';
  habilitarNext = '';

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  @ViewChild('closebuttonview',  {static: false}) closebuttonview;

  constructor(
    private fb: FormBuilder,
    public _prodService: ProductoService,
    public _provService: ProveedorService,
    public _catService: CategoriaService,
    public _imgAdd: ImageAddService,
    public _subCatService: SubcategoriaService,
    public router: Router
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('tokenHat') == null){
      this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });
    }
    
    this.getProducto();
    this.getCategoria();
    this.getProveedores();
  }
  
  getProducto(){
    this._prodService.getProductos().subscribe(resp => {
      this.productos = resp.productos;
      this.estadoBtnAdd = false;
    });
  }
  
  getCategoria(){
    this._catService.getCategoria().subscribe(resp => {
      this.categorias = resp;
    });
  }

  getSubCategoria(idCat, opt){
    if (opt === 2) {
      if(idCat != this.producto.subcategoria['categoria']._id){
        this.cambioCat = true;
      }else{
        this.cambioCat = false;
      }
    }
  
    this._subCatService.getSubCatId(idCat).subscribe(resp=>{
      this.subcategorias = resp;
    });
  }

  getProveedores(){
    this._provService.getproveedor().subscribe(resp => {
      this.proveedores = resp;
    });
  }

  searchProd(termino){
    if (termino == "") {
      this.coincidencia = true;
      this.getProducto();
    }else{
      this._prodService.searchProd(termino).subscribe(resp => {
        
        if (resp.length === 0) {
          this.coincidencia = false;  
        }else{
          this.productos = resp;
          this.coincidencia = true;
        }
      });
    }
  }

  getDataProd(prod: Producto){
    this.producto = prod;
    this.imgTemp = prod.img;
    this.imgTempAux = prod.img;
    this.idProducto = prod._id;
  
    console.log(this.idProducto);
    this.profileForm = this.fb.group({
      nombre: [prod.nombre, Validators.required],
      unidadMedida: [prod.unidadMedida, Validators.required],
      stock: [prod.stock, Validators.required],
      precioUni: [prod.precioUni, Validators.required],
      categoria: [prod.subcategoria['categoria']._id, Validators.required],
      proveedor: [prod.proveedor['_id'], Validators.required],
      subcategoria: [prod.subcategoria['_id'], Validators.required],
      imgProdAdd: this.fb.array([
        this.fb.control('')
      ])
    });
    
    this.provNom = prod.proveedor['razonSoc'];
    this.idProv = prod.proveedor['_id'];
    this.idSubC = prod.subcategoria['_id'];
    this.subCNom = prod.subcategoria['descripcion'];
    this.idCat = prod.subcategoria['categoria']._id;
    this.catNom = prod.subcategoria['categoria']._descripcion;

    this.getSubCategoria(prod.subcategoria['categoria']._id, 2);
    this.getData = true;
    this.cambioCat = false;
  }

  addProducto() {
    let prod = this.profileForm;

    if(this.profileForm.valid === true){
      this.estadoBtnAdd = true;
      let existe = false;

      for (let i = 0; i < this.productos.length; i++) {
        if(this.productos[i].nombre === prod.value.nombre){
          existe = true;
        }
      }
  
      if (!existe) {
        this._catService.subirImg(this.imgTemp).then(url => {
          const producto = {
            nombre: prod.value.nombre,
            precioUni: prod.value.precioUni,
            unidadMedida: prod.value.unidadMedida,
            img: url,
            subcategoria: prod.value.subcategoria,
            stock: prod.value.stock,
            proveedor: prod.value.proveedor
          };
    
          this._prodService.addProducto(producto).subscribe(prod => {
            if(this.imgAdds.length > 0){
              for (let j = 0; j < this.imgAdds.length; j++) {
                this._catService.subirImg(this.imgAdds[j]).then(urlImg => {
                  let imgA = {
                    url: urlImg,
                    producto: prod._id
                  }
                  
                  this._imgAdd.addImgAdd(imgA).subscribe(correcto => {
                    this.contImgA = this.contImgA + 1;
                    if(this.contImgA === this.imgAdds.length){
                      this.getProducto();
                      this.closebuttonadd.nativeElement.click();
                    }
                  });
                });
              }
            }else{
              this.getProducto();
              this.closebuttonadd.nativeElement.click();
            }
          });
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Este producto ya existe'
        });
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe llenar todos los campos'
      });
    
      this.estadoBtnAdd = false;
      return;
    }
  }

  get imgProdAdd() {
    return this.profileForm.get('imgProdAdd') as FormArray;
  }

  addAlias(opt) {
    if(opt === 1){
      if(!this.imgTemp){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha seleccionado imagen principal'
        });
  
        return;
      }
    }

    if (this.imgAdds[this.contImg] === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha seleccionado ninguna imagen'
      });

      return;
    }else{
      if (this.imgAdds.length < 3) {
        this.validarImg = true;
      }else{
        this.validarImg = false;
      }

      this.imgProdAdd.push(this.fb.control(''));
      this.contImg = this.contImg + 1;
    }
    
  }

  getAliasAdd(id) {
    this.selectId = id;
    this.vaciarImgAdd();

    this._imgAdd.getimgAdd(id).subscribe(resp => {
      if(resp.length === 0){
          this.validarImg = true;
          this.getImg = true;
      }else{
        this.selectProdImg = resp;

        for (let i = 0; i < resp.length; i++) {
          this.imgAdds[this.contImg] = resp[i].url;
          this.contImg = this.contImg + 1;

          if(i === (resp.length-1)){

            for (let k = 0; k < this.imgAdds.length; k++) {
              console.log(this.contImg);
              if(this.imgProdAdd.length === 4){
                this.validarImg = false;
              }else{
                this.validarImg = true;
                this.imgProdAdd.push(this.fb.control(''));
              }
            }

            this.getImg = true;
          }
        }
      }
    });
  }

  addImagesAdicionales() {
      for (let i = 0; i < this.imgAdds.length; i++) {
        console.log(this.imgAdds[i].substring(0,5));
        if(this.imgAdds[i].substring(0,5) === "https"){
          console.log("No hacer nada");
        }else{
          this._catService.subirImg(this.imgAdds[i]).then(url => {
            let imgA = {
              url: url,
              producto: this.selectId
            }
            
            this._imgAdd.addImgAdd(imgA).subscribe(correcto => {
              this.closebuttonview.nativeElement.click();
            });
          });
        }
      }
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

  selectImgAdd(file: File, index){
    if (!file) {
      return this.imgAdds[index] = null;
    }
  
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgAdds[index] = reader.result;
    }

    setTimeout(() => {
      if(this.imgAdds.length === 4){
        this.validarImg = false;
      }
    }, 200);
  }

  vaciarImgAdd(){
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      stock: ['', Validators.required],
      precioUni: ['', Validators.required],
      categoria: ['', Validators.required],
      proveedor: ['', Validators.required],
      subcategoria: ['', Validators.required],
      imgProdAdd: this.fb.array([
        this.fb.control('')
      ])
    });

    this.validarImg = true;
    this.imgTemp = null;
    this.imgAdds = [];
    this.contImgA = 0;
    this.contImg = 0;
  }

  getImgAdds(id){
    this.imgAdds = [];
    this._imgAdd.getimgAdd(id).subscribe(resp => {
        for (let i = 0; i < resp.length; i++) {
           this.imgAdicionales[i] = resp[i];
        }

        this.conteoAdd = 4 - resp.length;
  
        console.log(this.conteoAdd);
        if(this.conteoAdd > 0){
          this.validarImg = true;
          for (let j = 0; j < this.conteoAdd; j++) {
            this.imgAdds[j] = 'assets/img/addImg.png';
          }
        }else{
          this.validarImg = false;
        }
        
      this.getImg = true;
    });
  }

  eliminarImgAdd(option, index){
    //Agregar: Llamada al metodo desde el modal Agregar
    //Imagenes: Llamada al metodo desde el modal View
    
    this.validarImg = true;
    this.contImg = this.contImg - 1;
    this.imgAdds.splice(index, 1);
    this.imgProdAdd.removeAt(index);
    
    console.log(this.selectProdImg[index]._id);

      //llamar al web service

    if(option === "Imagenes"){
      this._imgAdd.eliminarImg(this.selectProdImg[index]._id).subscribe(resp => {
        console.log(resp);
      });
    }
  }

  soloDecimales(e){
		var key = window.Event ? e.which : e.keyCode;
		if ((key >= 48 && key <= 57) || (key==13) || (key==46)){
			return true;
		}else{
			alert("Error.. Ingresar solo números ó punto");
			e.preventDefault();
		}
  }

  updProducto(){
    let prod = this.profileForm;
    prod.value.id = this.idProducto;

    if (this.imgTemp === this.imgTempAux) {
      prod.value.img = this.imgTemp;
      this._prodService.updProducto(prod.value).subscribe(resp => {
        this.getProducto();
        this.closebuttonupd.nativeElement.click();
      });
    }else{
      this._catService.subirImg(this.imgTemp).then(url => {
        prod.value.img = url;
        this._prodService.updProducto(prod.value).subscribe(resp => {
          this.getProducto();
          this.closebuttonupd.nativeElement.click();
        });
      });
    }
    
  }
}
