import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from 'src/app/Servicios/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit {

  crearProducto: FormGroup;
  submitted = false;
  loading = false;
  id : string | null;
  titulo = 'Agregar Producto';

  constructor(private fb: FormBuilder, private productoService: ProductoService, private router: Router,
    private toastr: ToastrService, private aRoute: ActivatedRoute) {

    this.crearProducto = fb.group({
      nombre: ['', Validators.required],
      referencia: ['', Validators.required],
      costo: ['', Validators.required],
      precio: ['', Validators.required],
      entrada: [''],
      salida: [''],
      stock: ['']
    });

    //escuchar id en la url

    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarProducto() {
    this.submitted = true;
    if (this.crearProducto.invalid) {
      return;
    }
    if (this.id === null) {
      this.agregarProducto();
    } else {
      this.editarProducto(this.id);
    }
  }

  agregarProducto(){

    let entrada = 0;
    let salida = 0;

    entrada = this.crearProducto.value.entrada

    const producto: any = {
      nombre: this.crearProducto.value.nombre,
      referencia: this.crearProducto.value.referencia,
      costo: this.crearProducto.value.costo,
      precio:  this.crearProducto.value.precio,
      entrada:Number(this.crearProducto.value.entrada),
      salida: Number(this.crearProducto.value.salida),
      stock: this.crearProducto.value.entrada-this.crearProducto.value.salida,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this.loading = true;
    this.productoService.agregarProducto(producto).then(() => {
      this.toastr.success('El Producto se agrego exitosamente', 'Producto Registrado', {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      this.router.navigate(['/inventario']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });

  }

  esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar Producto';
      this.loading = true;
      this.productoService.getProducto(this.id).subscribe(data=>{
        this.loading= false;
        this.crearProducto.setValue({
          nombre: data.payload.data()['nombre'],
          referencia: data.payload.data()['referencia'],
          costo: data.payload.data()['costo'],
          precio: data.payload.data()['precio'],
          entrada: data.payload.data()['entrada'],
          salida: data.payload.data()['salida'],
          stock: data.payload.data()['stock'],
        });
      });
    }
  }

  editarProducto(id: string){
    const producto: any = {
      nombre: this.crearProducto.value.nombre,
      referencia: this.crearProducto.value.referencia,
      costo: this.crearProducto.value.costo,
      precio: this.crearProducto.value.precio,
      fechaActualizacion: new Date()
    }

    this.loading = true;
    this.productoService.actualizarProducto(id, producto).then(()=>{
      this.loading = false;
      this.toastr.info('El Producto fue modificado', 'Producto Actualizado', {
        positionClass : 'toast-bottom-right'
      });
      this.router.navigate(['/inventario'])
    });
  }
}
