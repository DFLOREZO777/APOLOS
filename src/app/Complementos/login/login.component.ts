import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorsService } from 'src/app/Servicios/firebase-code-errors.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUsuario : FormGroup;
  constructor(fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private aRoute: ActivatedRoute, private afAuth: AngularFireAuth,
    private FireError: FirebaseCodeErrorsService) { 

      this.loginUsuario = fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

  ngOnInit(): void {
  }

  login(){
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;
    
    this.afAuth.signInWithEmailAndPassword(email,password).then((user)=>{
      this.router.navigate(['/navbar'])
      /*console.log(user);*/
     /* if(user.user?.emailVerified){
         this.router.navigate(['/navbar'])
      }else{
        this.router.navigate(['/verificar-correo'])
      }*/
    }).catch((error)=>{
      this.toastr.error(this.FireError.firebaseError(error.code), 'Error');
      console.log(error);
    });
  }

}
