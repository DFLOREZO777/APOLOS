import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filtroCartera'
})
export class FiltroCarteraPipe implements PipeTransform {

  transform(value: any [], ...args: any[]): any {
    const resultadoCartera = [];
    for(const cartera of value){
      for (const fecha of args){
        if(fecha.fechaIni <= cartera.fecha.seconds && cartera.fecha.seconds <= fecha.fechaFin){
           resultadoCartera.push(cartera);
        }
      }
    }
    return resultadoCartera
}
}
