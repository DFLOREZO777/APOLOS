import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCodeErrorsService {

  constructor() { }


  firebaseError(code: string){

    switch(code){
      //El correo ya existe
      case 'auth/email-already-in-use':
      return 'El usuario ya existe'
      //contraseña debil
      case 'auth/weak-password':
      return 'La contraseña es muy debil'
      //correo no valido
      case 'auth/invalid-email':
      return 'Correo no Valido'
      //Contrseña incorrecta
      case 'auth/wrong-password':
      return 'Contraseña Incorrecta'
      //Usuario incexistente
      case 'auth/user-not-found':
      return 'El usuario no existe'
      default:
        return 'Error desconocido'
    }
  }
}
