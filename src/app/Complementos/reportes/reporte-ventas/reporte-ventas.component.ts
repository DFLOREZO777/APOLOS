import { Component, OnInit } from '@angular/core';
import { RepotesService } from 'src/app/Servicios/repotes.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var window:any;

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.scss']
})
export class ReporteVentasComponent implements OnInit {

  venta : any []=[];
  factura : any []= [];
  detalle : any []= [];
  pago : any [] = [];
  query = '';
  query1 = '';
  query2 = '';
  formModal: any ;

  constructor(private reportesServices : RepotesService , private toastr: ToastrService, private router: Router ) { }

  ngOnInit(): void {
    this.getVentas();
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
  }

  getVentas(){
    this.reportesServices.getVentas().subscribe(data=>{
      this.venta = [];
      data.forEach((element: any)=>{
        this.venta.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
        this.venta.sort((a,b)=> a.remision - b.remision);
      // console.log(this.venta);
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
      this.venta = this.venta.filter( value => value.fechaIngreso.seconds <= fechaFinal);
      switch (this.venta.length){
        case 0:
          //this.validor = true;
          break;
        default:
          break;
      }
     // console.log(filtros)
    }else if(isNaN(fechaFinal)&& !isNaN(fechaIni)){
      //console.log("se ingrreso solo fecha Inicial")
      this.venta = this.venta.filter( value => value.fechaIngreso.seconds >= fechaIni);
      //console.log(filtros)
      switch (this.venta.length){
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
      filtros = this.venta.filter(value => fechaIni <= value.fechaIngreso.seconds)
      this.venta = filtros.filter((value: any)=> value.fechaIngreso.seconds <= fechaFinal )
      //console.log(ultiFiltro)
      switch (this.venta.length){
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

  openModal(remision : number){ 
    
    this.formModal.show();
    this.reportesServices.getFactura(remision).subscribe(data =>{
      data.forEach((element:any)=>{
        this.factura.push({
          remision: element.data().remision,
          usuario: element.data().usuario,
          fecha: element.data().fecha,
          cliente: element.data().cliente,
          tipoFac : element.data().tipoFac,
          detalle: element.data().detalle,
          pago: element.data().pago,
        });
        //console.log(this.factura)
        this.datoDetalle(this.factura);
        this.datoPago(this.factura)
      });
    });
   
  }

  datoDetalle( factura : any){
    for(let i of factura){
      this.detalle = i.detalle;
    //  console.log(this.detalle)
    }
  }

  datoPago(factura : any){
    for (let i of factura){
      this.pago = i.pago;
    }
  }

  closeModal(){
   
    this.formModal.hide();
    this.factura = [];
    this.detalle = [];
    this.pago = [];
    
  }
}
