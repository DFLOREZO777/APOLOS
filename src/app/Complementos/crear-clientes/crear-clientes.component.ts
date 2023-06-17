import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseCodeErrorsService } from 'src/app/Servicios/firebase-code-errors.service';
import { ClienteService } from 'src/app/Servicios/cliente.service';



@Component({
  selector: 'app-crear-clientes',
  templateUrl: './crear-clientes.component.html',
  styleUrls: ['./crear-clientes.component.scss']
})
export class CrearClientesComponent implements OnInit {

  crearCliente: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Cliente';
  validor = false;
  validor2 = false;

  constructor( private fb: FormBuilder, private clienteService: ClienteService, private router: Router,
    private toastr: ToastrService, private aRoute: ActivatedRoute, private afAuth: AngularFireAuth,
    private FireError: FirebaseCodeErrorsService) { 

      this.crearCliente = fb.group({
        documento : ['', Validators.required],
        nombre:['',Validators.required],
        telefono:['',Validators.required],
        monto:[''],
        abono:[''],
        saldo:['']

      });

      this.id = this.aRoute.snapshot.paramMap.get('id');
    }

  ngOnInit(): void {
    this.esEditar();
  }
  
  agregarEditarCliente(){
    this.submitted = true;
    if (this.crearCliente.invalid){
      return;
    }
    if (this.id === null){
      this.comprobarDoc();
        
    }else{
      this.editarCliente(this.id);
    }
  }

  comprobarDoc(){
    const dato =String(this.crearCliente.value.documento);
 
      this.clienteService.addCliente(dato).forEach((element:any)=>{ 
        let aux = element.length;
        switch (aux) {
           case 0:
             //console.log("cliente creado");
             this.agregarCliente();
             break;
           default:
             //console.log("El cliente existe");
             break;
         }
       });
    
  }

  agregarCliente(){
    const cliente: any = {
      documento: this.crearCliente.value.documento,
      nombre: this.crearCliente.value.nombre,
      telefono: this.crearCliente.value.telefono,
      monto: Number(this.crearCliente.value.monto),
      abono: Number(this.crearCliente.value.abono),
      saldo: this.crearCliente.value.monto - this.crearCliente.value.abono,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    if (cliente.documento === null){
      console.log("No creado");
    }else{
      // console.log(cliente)
    this.loading = true;
    this.clienteService.agregarCliente(cliente).then(()=>{
      this.toastr.success('El cliente fue registrado exitosamente','Cliente Registrado',{
      });
      this.loading = false;
      this.crearCliente.reset();
      this.router.navigate(['/clientes']);
    }).catch(error=>{
      console.log(error);
      this.loading= false;
    });
    }
   
  }

  esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar Cliente';
      this.loading = true;
      this.clienteService.getCliente(this.id).subscribe(data=>{
        this.loading= false;
        //console.log(data.payload.data());
        this.crearCliente.setValue({
          documento: data.payload.data()['documento'],
          nombre: data.payload.data()['nombre'],
          telefono: data.payload.data()['telefono'],
          monto: data.payload.data()['monto'],
          abono: data.payload.data()['abono'],
          saldo: data.payload.data()['saldo'],
        });
      });
    }
  }

  editarCliente(id: string){
    const cliente: any = {
      nombre: this.crearCliente.value.nombre,
      telefono: this.crearCliente.value.telefono,
      //monto: this.crearCliente.value.monto,
      //saldo: this.crearCliente.value.saldo,
      fechaActualizacion: new Date()
    }

    this.loading = true;
    this.clienteService.actualizarCliente(id, cliente).then(()=>{
      this.loading = false;
      this.toastr.info('El cliente fue modificado', 'Cliente Actualizado', {
        positionClass : 'toast-bottom-right'
      });
      this.router.navigate(['/clientes'])
    });
  }

  validarCampo(event : any){
    let valor = event.target.value;
    //console.log(valor)
     valor = parseInt(valor);

     if (isNaN(valor)){
      this.validor = true;
      this.crearCliente.value.monto = 0;
     }else{
      this.validor = false;
     }
  }

  calculoSaldo( event : any){
    let cantidad = event.target.value;
    let resta = 0;
    cantidad = parseInt(cantidad);


    if (isNaN(cantidad)){
      this.validor2 = true;
      this.crearCliente.value.abono = 0;
     }else{
      this.validor2 = false;
     }

    if (cantidad < 0) {
      this.toastr.info('la cantidad no puede ser menor que 0', 'Mensaje de Aviso');
    } else {
      var b = (<HTMLInputElement>document.getElementById("monto")).value;
      //console.log(b)
      resta =  parseFloat(b)-parseFloat(cantidad);
      (<HTMLInputElement>document.getElementById("saldo")).value = String(resta);
    }
   // console.log(multi)
  }


}
