import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/Servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

cliente: any[] = [];
factura: any;
query = '';
rolUsu = '';

  constructor(private clienteService: ClienteService, private toastr: ToastrService ) { }
  
  

  ngOnInit(): void {
    this.getClientes();

  }

  getClientes(){
    this.clienteService.getClientes().subscribe(data=>{
      this.cliente=[];
      //console.log (data);
      data.forEach((element:any)=>{
        this.cliente.push({
          id:element.payload.doc.id,
         ...element.payload.doc.data()
        });
      });
      //console.log(this.cliente);
    });
  }

  eliminarCliente(id:string){ 
   for(let i of this.cliente){
      if (i.monto > 0){
        this.toastr.info('Este cliente no se puede eliminar, ya que posee un regitro en la base de datos', 'Error en el proceso',{
          positionClass:'toast-bottom-right'
        });
      }else{
        this.clienteService.eliminarCliente(id).then(()=>{
          console.log('Empleado eliminado exitosamente');
          this.toastr.error('el usuario fue eliminado con exito', 'Usuario Eliminado',{
            positionClass:'toast-bottom-right'
          });
        }).catch(error=>{
          console.log(error);
        });
      }
    }   
  }
}
