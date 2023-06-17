import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from 'src/app/Servicios/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntradasService } from 'src/app/Servicios/entradas.service';


@Component({
  selector: 'app-entrada-producto',
  templateUrl: './entrada-producto.component.html',
  styleUrls: ['./entrada-producto.component.scss']
})
export class EntradaProductoComponent implements OnInit {

  titulo = "Ingreso de Producto";
  loading = false;
  submitted = false;
  id: string | null;
  entradaProducto: FormGroup;
  lastEntrada: number = 0;
  newEntrada: number = 0;
  lastSalida : number = 0;
  newStock : number = 0;

  constructor(private fb: FormBuilder, private productoService: ProductoService, private router: Router,
    private toastr: ToastrService, private aRoute: ActivatedRoute, private entradaService: EntradasService) {

    this.entradaProducto = fb.group({
      nombre: [''],
      referencia: [''],
      stock: [''],
      entrada: ['']
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    //console.log(this.id);
  }

  getProducto() {
    if(this.id !== null){
    this.productoService.getProducto(this.id).subscribe(data => {
      //console.log(data);
      this.loading = false;
      this.lastEntrada = parseInt(data.payload.data()['entrada']);
      this.lastSalida = parseInt(data.payload.data()['salida'])
      //console.log(this.lastEntrada);
      //console.log(data.payload.data()['nombre']);
      this.entradaProducto.setValue({
        nombre: data.payload.data()['nombre'],
        referencia: data.payload.data()['referencia'],
        stock: data.payload.data()['stock'],
        entrada: 0
      });
    });
  }
  }

  datoEntrada(){
    const entrada = parseInt(this.entradaProducto.value.entrada);
    return entrada;
  }


  ingresarProducto(id: string) {
    this.newEntrada = this.lastEntrada + this.datoEntrada();
    this.newStock = this.newEntrada - this.lastSalida;
    //console.log(this.newEntrada);

    const producto: any = {
      nombre: this.entradaProducto.value.nombre,
      referencia: this.entradaProducto.value.referencia,
      stock: this.newStock,
      entrada: this.newEntrada,
      fechaIngreso: new Date()
    }
    if (this.datoEntrada()< 0){
      this.toastr.info('El valor de la cantidad es negativo y no se puede ingresar','Dato Erroneo', {
        positionClass: 'toast-bottom-right'
      });
    }else{
      this.loading = true;
      this.entradaService.agregarEntrada(producto).then(()=>{

      }).catch(error =>{
        console.log(error)
        this.loading = false;
      });
      
      this.productoService.actualizarProducto(id, producto).then(() => {
        this.loading = false;
        this.toastr.success('Ingreso de cantidad con exito', 'Ingreso Exitoso', {
          positionClass: 'toast-bottom-right'
        });
        this.router.navigate(['/inventario']);
      });
    }//console.log(this.datoEntrada());
  }

  agregarEntrada() {
    this.submitted = true;
    if (this.entradaProducto.invalid) {
      return;
    }

    if (this.id === null) {
      this.router.navigate(['/inventario']);
    }
    else {
      this.ingresarProducto(this.id);
      //this.registroEntrada();
    }
  }


  ngOnInit(): void {
    this.getProducto();
  }

}
