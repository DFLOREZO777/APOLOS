import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  constructor(private firestore:AngularFirestore) { }
  
  agregarCartera(cartera:any): Promise<any>{
    return this.firestore.collection('cartera').add(cartera);
  }

 getCartera (id : string) : Observable <any>{
  return this.firestore.collection('cartera',ref => ref.where('idCli','==', id)).snapshotChanges();
  }

  updateCartera(id : string, data: any){
    return this.firestore.collection('cartera').doc(id).update(data);
  }

  prueba (id : string) : Observable <any>{
    return this.firestore.collection('cartera',ref => ref.where('id','==', id)).valueChanges();
    }

}
