import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable , of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private firestore:AngularFirestore) { }

  getClientes(): Observable <any>{
    return this.firestore.collection('cliente', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  agregarCliente(cliente:any): Promise<any>{
    return this.firestore.collection('cliente').add(cliente);
  }

  getCliente(id: string): Observable <any>{
    return this.firestore.collection('cliente').doc(id).snapshotChanges();
  }

  actualizarCliente(id: string, data: any): Promise<any>{
    return this.firestore.collection('cliente').doc(id).update(data);
  }

  eliminarCliente(id:string): Promise<any>{
    return this.firestore.collection('cliente').doc(id).delete();
  }

  getClienteDoc(documento:string) : Observable <any>{
    return this.firestore.collection('cliente', ref => ref.where('documento','==',documento)).get();  
  }

  getIdCliente(documento:string) : Observable <any>{
    return this.firestore.collection('cliente', ref => ref.where('documento','==',documento)).snapshotChanges(); 
  }

   addCliente (nuevoCliente : string): Observable <any> {
    return this.firestore.collection('cliente',ref => ref.where('documento','==',nuevoCliente)).valueChanges();
    //var clienteDocumento = this.firestore.collection('cliente',ref => ref.where('documento','==',nuevoCliente));
   // var clienteObservable = clienteDocumento.valueChanges();
    //return clienteObservable ;
   }
  
}

