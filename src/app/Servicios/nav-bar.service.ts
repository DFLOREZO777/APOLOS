import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  mensaje!: string;

  private mensajeSubject: Subject<string> = new Subject<string>();
  
  enviarMensajeObservable = this.mensajeSubject.asObservable();

  enviarMensaje(mensaje: string){

    this.mensajeSubject.next(mensaje);
  }
  
}
