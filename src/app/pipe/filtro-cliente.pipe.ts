import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroCliente'
})
export class FiltroClientePipe implements PipeTransform {

  transform(value: any[],args: any): any {
    const resultCliente = [];
    for(const cliente of value){
      if(cliente.documento.toLowerCase().indexOf(args.toLowerCase()) > -1){
         resultCliente.push(cliente);
      };
    };
   // console.log(resultUsuario)
    return resultCliente;
  }
  

}
