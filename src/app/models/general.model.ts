export class Producto {
    constructor(
        public nombre: string,
        public unidadMedida: string,
        public precioUni: number,
        public img: string,
        public subcategoria: string,
        public proveedor: string,
        public stock: number,
        public _id?: string,
    ){}
}

export class Proveedor {
    constructor(
        public ruc: string,
        public razonSoc: string,
        public telefono: string,
        public direccion: string,
        public correo: string,
        public ciudad: string,
        public representante: string,
        public _id?: string,
    ){}
}
export class Categoria {
    constructor(
        public descripcion: string,
        public img: string,
        public _id?: string,
    ){}
}

export class SubCategoria {
    constructor(
        public descripcion: string,
        public categoria: string,
        public _id?: string,
    ){}
}

export class Solicitud {
    constructor(
        public fecha: string,
        public subtotal: number,
        public iva: number,
        public total: number,
        public usuario: string,
        public estado?: string,
        public comentario?: string,
        public _id?: string
    ){}
}

export class DetalleSolicitud {
    constructor(
        public cantidad: string,
        public solicitud: string,
        public producto: string,
        public subtotal: number,
        public _id?: string
    ){}
}

export class Pedido {

}

export class DetallePedido {

}