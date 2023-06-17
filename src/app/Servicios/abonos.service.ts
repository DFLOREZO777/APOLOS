import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonosService {

  constructor(private firestore:AngularFirestore) { }

  addAbono(abono:any): Promise<any>{
    return this.firestore.collection('abonos').add(abono);
  }

  getAbonoRemi(remision : number): Observable<any>{
    return this.firestore.collection('abonos',ref => ref.where('remision','==', remision)).snapshotChanges();

  }

}


