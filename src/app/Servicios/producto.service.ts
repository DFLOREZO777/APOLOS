import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';
//import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private firestore: AngularFirestore) { }

  getProductos(): Observable <any>{
    return this.firestore.collection('producto', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  agregarProducto(producto:any): Promise<any>{
    return this.firestore.collection('producto').add(producto);
  }

  getProducto(id: string): Observable <any>{
    return this.firestore.collection('producto').doc(id).snapshotChanges();
  }

  actualizarProducto(id: string, data: any): Promise<any>{
    return this.firestore.collection('producto').doc(id).update(data);
  }

  eliminarProducto(id:string): Promise<any>{
    return this.firestore.collection('producto').doc(id).delete();
  }

  getIdProducto(referencia:string) : Observable <any>{
    return this.firestore.collection('producto', ref => ref.where('referencia','==',referencia)).snapshotChanges(); 
  }



}
