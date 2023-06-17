import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filtroUsuario'
})
export class FiltroUsuarioPipe implements PipeTransform {

  transform(value: any[],args: any): any {
      const resultUsuario = [];
      for(const usuario of value){
        if(usuario.nombre.toLowerCase().indexOf(args.toLowerCase()) > -1){
           resultUsuario.push(usuario);
        };
      };
     // console.log(resultUsuario)
      return resultUsuario;
    }
    
  }

