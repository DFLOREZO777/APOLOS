import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseCodeErrorsService } from 'src/app/Servicios/firebase-code-errors.service';


@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.scss']
})
export class CrearUsuariosComponent implements OnInit {

  crearUsuario: FormGroup;
  submitted = false;
  loading = false;
  id : string | null;
  titulo = 'Agregar Usuario';

  constructor(fb: FormBuilder, private usuarioService: UsuarioService, private router: Router,
     private toastr: ToastrService, private aRoute: ActivatedRoute, private afAuth: AngularFireAuth,
     private FireError: FirebaseCodeErrorsService) {

    this.crearUsuario = fb.group({
      nombre: ['', Validators.required], 
      correo: ['', Validators.required, Validators.email],
      contrasena: ['', Validators.required, Validators.minLength(6)],
      rol: ['', Validators.required],
    });

    this.id = this.aRoute.snapshot.paramMap.get('id');
   // console.log(this.id);
   }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarUsuario(){
    this.submitted = true;
    if (this.crearUsuario.invalid){
      return;
    }
    if (this.id === null){
      this.agregarUsuario();
    }else{
      this.editarUsuario(this.id);
    }
  }




  agregarUsuario(){
    
    const usuario: any = {
      nombre: this.crearUsuario.value.nombre,
      correo: this.crearUsuario.value.correo,
      contrasena: this.crearUsuario.value.contrasena,
      rol: this.crearUsuario.value.rol,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    const email = this.crearUsuario.value.correo;
    const password = this.crearUsuario.value.contrasena;  
    
    this.loading = true;

    this.afAuth.createUserWithEmailAndPassword(email, password).then(()=>{
      //console.log(user);
      this.usuarioService.agregarUsuario(usuario).then(()=>{
       /* this.toastr.success('El usuario fue registrado exitosamente','Usuario Registrado',{
          positionClass:'toast-bottom-right'
        });
        this.loading= false;
        this.router.navigate(['/usuarios']);*/
        this.verificarCorreo();
      }).catch(error=>{
        console.log(error);
        this.loading = false;
      });
    }).catch(error=>{
      this.toastr.error(this.FireError.firebaseError(error.code), 'Error');
      console.log(error);
      this.loading = false;
    });
  }

  verificarCorreo(){
    this.afAuth.currentUser.then((user)=>user?.sendEmailVerification()
    .then(()=>{
      this.toastr.info('Se ha enviado un correo para verificaciòn','Verificar Correo',{
        positionClass:'toast-bottom-right'
      });
      //this.loading= false;
      this.router.navigate(['/usuarios']);
    }))
  }
  
  editarUsuario(id: string){
    const usuario: any = {
      nombre: this.crearUsuario.value.nombre,
      correo: this.crearUsuario.value.correo,
      contrasena: this.crearUsuario.value.contrasena,
      rol: this.crearUsuario.value.rol,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this.usuarioService.actualizarUsuario(id, usuario).then(()=>{
      this.loading = false;
      this.toastr.info('El usuario fue modificado', 'Usuario Actualizado', {
        positionClass : 'toast-bottom-right'
      });
      this.router.navigate(['/usuarios']);
    });
    
  }
  
  esEditar(){
    if (this.id !== null){
      this.titulo = 'Editar Usuario';
      this.loading = true
      this.usuarioService.getUsuario(this.id).subscribe(data=>{
        this.loading = false;
        //console.log(data.payload.data());
       // console.log(data.payload.data()['nombre']);
        this.crearUsuario.setValue({
          nombre: data.payload.data()['nombre'],
          correo: data.payload.data()['correo'],
          contrasena: data.payload.data()['contrasena'],
          rol: data.payload.data()['rol'],
       
        });
      });
    }
  }


}
