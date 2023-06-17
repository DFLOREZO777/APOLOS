import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CarteraService} from 'src/app/Servicios/cartera.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { AbonosService } from 'src/app/Servicios/abonos.service';
import { ClienteService } from 'src/app/Servicios/cliente.service';

  

declare var window:any;


@Component({
  selector: 'app-cartera',
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.scss']
})
export class CarteraComponent implements OnInit {

  formModalAbono : any;
  formModal: any ;
  cartera : any []= [];
  abonoDetalle : any []= [];
  cliente : any []= [];
  registroAbono : any []= [];
  query = '';
  query2 = '';
  id : string | null;
  validor = false;
  abono : FormGroup;
  saldo = 0;
  remision = 0;
  idMod = '';
  idCli = '';
  abonoMod= 0;
  isDisabled= true;

  constructor( fb: FormBuilder,private aRoute: ActivatedRoute, private carteraServices:CarteraService,
    private toastr: ToastrService, private abonoServices: AbonosService, private clienteServices : ClienteService) { 

    this.abono = fb.group({
      metodo: ['',Validators.required],
      credito: ['',Validators.required],
      abono : ['', Validators.required],
      saldo : ['',Validators.required]

    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
   this.getCartera();
   this.formModal = new window.bootstrap.Modal(
    document.getElementById("exampleModal")
  );
  this.formModalAbono = new window.bootstrap.Modal(
    document.getElementById("modalAbonos")
  );
   
  }

  getCliente(doc : string){
    this.clienteServices.getIdCliente(doc).subscribe(data=>{
      data.forEach((element:any)=>{
        this.cliente.push({
          id:element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }

 getCartera(){
  this.validor = false;
  if(this.id !== null){
    this.carteraServices.getCartera(this.id).subscribe(data=>{
      this.cartera=[];
     data.forEach((element:any)=>{
    //console.log(element)
        this.cartera.push({
          id:element.payload.doc.id,
         ...element.payload.doc.data()
        });
      });
      //ordenar por remision cartera
      this.cartera.sort((a,b)=> a.remision - b.remision);
    });
  }
}

//filtro de fechas
  dato() {
    const var1 = new Date(this.query);
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
      this.cartera = this.cartera.filter( value => value.fecha.seconds <= fechaFinal);
      switch (this.cartera.length){
        case 0:
          this.validor = true;
          break;
        default:
          break;
      }
     // console.log(filtros)
    }else if(isNaN(fechaFinal)&& !isNaN(fechaIni)){
      //console.log("se ingrreso solo fecha Inicial")
      this.cartera = this.cartera.filter( value => value.fecha.seconds >= fechaIni);
      //console.log(filtros)
      switch (this.cartera.length){
        case 0:
          this.validor = true;
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
      filtros = this.cartera.filter(value => fechaIni <= value.fecha.seconds)
      this.cartera = filtros.filter((value: any)=> value.fecha.seconds <= fechaFinal )
      //console.log(ultiFiltro)
      switch (this.cartera.length){
        case 0:
          this.validor = true;
          break;
        default:
          break;
      }
    }
    }

    filtros.sort((a:any,b:any)=> a.fecha - b.fecha);
  }


//Calculo de cambio
 cambio( event : any){
 
  let abono = event.target.value;

  let valor = this.saldo - abono;

  let value = (<HTMLInputElement>document.getElementById("metodo")).value;

  const abonos : any ={
    metodo : this.abono.value.metodo,
    total: this.saldo,
    abona : this.abono.value.abono,
    saldo: valor
  }
  if (!value) {
    this.isDisabled = true;
    this.toastr.info('Por favor seleccione el metodo de pago', 'Metodo de Pago', {
      positionClass: 'toast-bottom-right'
    });
  }else{
  if(!Number(abono)){
    abono= 0;
    this.isDisabled = true;
    this.toastr.error('El valor ingresado no es valido', 'Error de información',{
      positionClass:'toast-bottom-right'
    });
  }  if (abono < 0) {
    this.isDisabled = true;
    this.toastr.error('El valor recibido no puede ser negativo', 'Error de información', {
      positionClass: 'toast-bottom-right'
    });
  }
  
  if(Number(abono) && abono > 0){
    this.isDisabled= false;
    if (abono > this.saldo){
      valor = 0;
    }
    (<HTMLInputElement>document.getElementById("saldo")).value = String(valor);

  }
}

while(this.abonoDetalle.length > 0){
  this.abonoDetalle = [];
  //console.log("Array vaciado");
}


 this.abonoDetalle.push(abonos);
 for (const value of this.cartera) {
  this.idCli = value.documento;
 }

 this.getCliente(this.idCli);

}

addAbono(){
  const abono = {
    remision : this.remision,
    fecha : new Date(),
    metodo: this.abonoDetalle[0].metodo,
    abona : this.abonoDetalle[0].abona,
    saldo : this.abonoDetalle[0].saldo
  }
  const datos ={
    abono: abono.abona + this.abonoMod,
    saldo: abono.saldo
  }
  //console.log(this.cliente)
  const abonoTotal = this.cliente[0].abono + abono.abona
  const data = {
    abono: this.cliente[0].abono + abono.abona,
    saldo: this.cliente[0].monto - abonoTotal
  }
  //console.log(data) 
  this.carteraServices.updateCartera(this.idMod, datos).then(()=>{
    this.isDisabled = true;
  });
  if(this.id !== null){
    this.clienteServices.actualizarCliente(this.id,data).then(()=>{
      this.toastr.success('Se actulizo cartera', 'Cartera Actualizada', {
        positionClass: 'toast-bottom-rigth'
      });
    })
  }

  this.abonoServices.addAbono(abono).then(()=>{
    this.doSomething();
  })
  
}

// Open modal Abono
  openModal(remision : number){
    const dato = this.cartera.findIndex( data => data.remision === remision);
    this.saldo = this.cartera[dato].saldo;
    if (this.saldo <= 0){

      this.toastr.info('No hay saldo en la en este registro de cartera', 'Saldo en 0', {
        positionClass: 'toast-bottom-rigth'
      })
    }else{
    this.formModal.show(); 
    this.remision = remision;
    
    this.idMod = this.cartera[dato].id;
    this.abonoMod = this.cartera[dato].abono;
    //console.log(this.idMod);
  }
  }

  // Close modal Abono
  doSomething(){
    this.formModal.hide(); 
    this.abono.reset();
  }

  //Close modal Abonos Detalles
  closeModal(){
    this.formModalAbono.hide();
    this.registroAbono = [];
  }

  //Open modal Abonos detalles
  openModalAbono(remision: number){
    this.formModalAbono.show();
    //console.log(remision)
    this.abonoServices.getAbonoRemi(remision).subscribe(data=>{
      this.registroAbono = [];
      //console.log (data);
      data.forEach((element:any)=>{
        this.registroAbono.push({
          id:element.payload.doc.id,
         ...element.payload.doc.data()
        });
        this.registroAbono.sort((a,b)=> a.fecha - b.fecha);
      });
    })
  }

}