import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  constructor(private firestore: AngularFirestore, private httpClient: HttpClient) { }

  getClientes(): Observable <any>{
    return this.firestore.collection('cliente', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

 /* getProductos(): Observable <any>{
    return this.firestore.collection('producto', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }*/

  getProductoRef(referencia:string) : Observable <any>{
    return this.firestore.collection('producto', ref => ref.where('referencia','==',referencia)).get();
    
  }

  agregarFactura(factura:any): Promise<any>{
    return this.firestore.collection('factura').add(factura);
  }

  getFacturaRem(): Observable <any>{
    return  this.firestore.collection('factura', ref => ref.orderBy('fecha', 'asc').limitToLast(1)).snapshotChanges();
  }

  


}
