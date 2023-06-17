import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
//import { collection, query, where, getDocs } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  filtroUsuario= '';
  
  constructor( private firestore: AngularFirestore) { }

  agregarUsuario(usuario: any): Promise<any>{
    return this.firestore.collection('usuario').add(usuario);
  }

  getUsuarios(): Observable <any>{
    return this.firestore.collection('usuario', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  eliminarUsuario(id:string): Promise<any>{
    return this.firestore.collection('usuario').doc(id).delete();
  }

  getUsuario(id:string): Observable<any>{
    return this.firestore.collection('usuario').doc(id).snapshotChanges();
  }

  actualizarUsuario( id: string, data: any): Promise <any>{
    return this.firestore.collection('usuario').doc(id).update(data);
  }

  buscarUsuario(buscar: string): Observable<any>{
      return this.firestore.collection('usuario', ref => ref.where('correo','==', buscar)).get();
  }
}
