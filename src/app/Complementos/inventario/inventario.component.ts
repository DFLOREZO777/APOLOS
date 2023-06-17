import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {ProductoService} from 'src/app/Servicios/producto.service'

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  producto: any[] = [];

  constructor(private productoService: ProductoService, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.getProductos();
  }


  getProductos(){
    this.productoService.getProductos().subscribe(data=>{
      this.producto=[];
      data.forEach((element:any)=>{
        this.producto.push({
          id:element.payload.doc.id,
         ...element.payload.doc.data()
        });
       // console.log(this.producto);
      });
    }) ;
   }


   eliminarProducto(id:string){ 
    for(let i of this.producto){


      if(i.salida > 0){
        this.toastr.info('Este producto ya tiene salidas en el stock, no se puede eliminar', 'Error de Proceso',{
          positionClass:'toast-bottom-right'
        });
      }else{
        this.productoService.eliminarProducto(id).then(()=>{
          console.log('Producto eliminado exitosamente');
          this.toastr.error('El Producto fue eliminado con exito', 'Producto Eliminado',{
            positionClass:'toast-bottom-right'
          });
        }).catch(error=>{
          console.log(error);
        });
      }
    }
    
  }

}
