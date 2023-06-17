import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorsService } from 'src/app/Servicios/firebase-code-errors.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent implements OnInit {

  recuperarPassword: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router,
    private toastr: ToastrService, private aRoute: ActivatedRoute, private afAuth: AngularFireAuth,
    private FireError: FirebaseCodeErrorsService) { 
      this.recuperarPassword = this.fb.group({
        email:['', Validators.required]
      })
    }

  ngOnInit(): void {
  }

  recuperar(){
    const email = this.recuperarPassword.value.email;
    this.afAuth.sendPasswordResetEmail(email).then(()=>{
      this.toastr.info('Por favor, confirmar en el correo para restablecimiento de contraseña','Recuperar Password')
      this.router.navigate(['/login']);
    }).catch((error)=>{
      this.toastr.error(this.FireError.firebaseError(error.code), 'Error');
    });
  }

}
