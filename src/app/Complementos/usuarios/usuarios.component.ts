import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuario: any[] = [];
  query='';

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private afAuth: AngularFireAuth,
    private fb: FormBuilder,) { 
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuario = [];
      //console.log(data);
      data.forEach((element: any) => {
        /*  console.log(element.payload.doc.id);*/
        /* console.log(element.payload.doc.data());*/
        this.usuario.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      //console.log(this.usuario);
    });
  }

  eliminarUsuario(id: string) {
    this.usuarioService.eliminarUsuario(id).then(() => {
      console.log('Empleado eliminado exitosamente');
      this.toastr.error('el usuario fue eliminado con exito', 'Usuario Eliminado', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error => {
      console.log(error);
    });
  }


}