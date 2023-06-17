import { Component, OnInit } from '@angular/core';
import { RepotesService } from 'src/app/Servicios/repotes.service'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reporte-entradas',
  templateUrl: './reporte-entradas.component.html',
  styleUrls: ['./reporte-entradas.component.scss']
})
export class ReporteEntradasComponent implements OnInit {
  
  entrada : any []=[];
  query = '';
  query1 = '';
  query2 = '';

  constructor(private reportesServices : RepotesService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEntradas();
  }

  getEntradas(){
    this.reportesServices.getEntradas().subscribe(data=>{
      this.entrada = [];
      data.forEach((element: any)=>{
        this.entrada.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
        this.entrada.sort((a,b)=>b.fechaIngreso - a.fechaIngreso );
      });

    });
  }

  dato() {
    const var1 = new Date(this.query1);
    var fechaIni = (var1.getTime()) / 1000;
    var fechaFinal = Date.parse(this.query2) / 1000;
    
    //console.log(fechaFinal)

    var filtros: any= [];

   // const  filtro =  this.cartera.filter(value =>  value.fecha.seconds >= fechaIni);

    if(isNaN(fechaIni) && isNaN (fechaFinal)){
     // console.log("no se ingreso ninguna fecha")
     this.toastr.info('No se a ingresado ninguna informacion para filtrar', 'No hay datos', {
      positionClass : 'toast-bottom-right'
    });

    }else if(isNaN(fechaIni) && !isNaN(fechaFinal)){
     // console.log("se ingreso solo fecha final")
      this.entrada = this.entrada.filter( value => value.fechaIngreso.seconds <= fechaFinal);
      switch (this.entrada.length){
        case 0:
          //this.validor = true;
          break;
        default:
          break;
      }
     // console.log(filtros)
    }else if(isNaN(fechaFinal)&& !isNaN(fechaIni)){
      //console.log("se ingrreso solo fecha Inicial")
      this.entrada = this.entrada.filter( value => value.fechaIngreso.seconds >= fechaIni);
      //console.log(filtros)
      switch (this.entrada.length){
        case 0:
          //this.validor = true;
          break;
        default:
          break;
      }
    }else{
      var ultiFiltro;
     // console.log("se ingresaron las dos fechas")
      if (fechaFinal < fechaIni){
        this.toastr.error('La fecha final es mayor a la fecha inicial', 'Error', {
          positionClass : 'toast-bottom-right'
        });
      }else{
      //console.log(fechaFinal > fechaIni)
      filtros = this.entrada.filter(value => fechaIni <= value.fechaIngreso.seconds)
      this.entrada = filtros.filter((value: any)=> value.fechaIngreso.seconds <= fechaFinal )
      //console.log(ultiFiltro)
      switch (this.entrada.length){
        case 0:
          //this.validor = true;
          break;
        default:
          break;
      }
    }
    }

    filtros.sort((a:any,b:any)=> a.fecha - b.fecha);
  }

}
