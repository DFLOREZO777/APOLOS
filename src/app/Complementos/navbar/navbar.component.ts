import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NavBarService } from 'src/app/Servicios/nav-bar.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  dataUser : any;
  email : any;
  rol ='';
  mensaje = '';

  constructor(private afAuth: AngularFireAuth, private router: Router, private UsuarioServices: UsuarioService,
    public navBarServices : NavBarService) { }

  ngOnInit(): void {
    this.alIniciar();
    
  }

  onVariableActualizada(valor : string){
    this.mensaje = valor;
  }

  alIniciar(){
     this.afAuth.currentUser.then((user)=>{
      if (user !== null){
        this.email = user.email;
      }
     
 if(user && user.emailVerified){
      //this.dataUser = user;
      this.email = user.email;
      //console.log(this.email)
    }else{
      this.router.navigate(['/login']);
    }
    this.getRol(this.email);
  });
  }

  getRol(dato: string){
   
    this.UsuarioServices.buscarUsuario(dato).subscribe(data=>{
      data.forEach((element:any)=>{
        this.rol = element.data().rol
        this.dataUser = element.data().nombre
      });
    });
  }


  logOut(){
    this.afAuth.signOut().then(()=> this.router.navigate(['/login']));
  }

}
