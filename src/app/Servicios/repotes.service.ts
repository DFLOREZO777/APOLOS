import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepotesService {

  constructor(private firestore: AngularFirestore) { }

  getEntradas(): Observable <any>{
    return this.firestore.collection('entrada', ref => ref.orderBy('fechaIngreso', 'asc')).snapshotChanges();
  }

  getVentas(): Observable <any>{
    return this.firestore.collection('factura', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
  }

  getFactura(remision: number): Observable<any>{
    return this.firestore.collection('factura', ref => ref.where('remision','==', remision)).get();
  }
}
