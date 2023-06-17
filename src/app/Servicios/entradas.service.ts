import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  constructor(private firestore: AngularFirestore) { } 

  getEntradas(): Observable <any>{
    return this.firestore.collection('entrada', ref => ref.orderBy('fechaIgreso', 'asc')).snapshotChanges();
  }

  agregarEntrada(entrada:any): Promise<any>{
    return this.firestore.collection('entrada').add(entrada);
  }


  /*getEntrada(id:string): Observable <any>{
    return this.firestore.collection('producto').doc(id).get('entrada')
  }*/
}
 