import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { AlarmService } from './alarm.service';
import { Reminder } from '../models/reminder.models';
import 'firebase/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: string | null = null;

  constructor(private auth: Auth, private firestore: AngularFirestore, private alarmService: AlarmService) { 
    this.auth.onAuthStateChanged(user => {
        this.userId = user ? user.uid : null;
    });
  }

  getUserId(): string | null {
      return this.userId;
  }

  register({ email, password }: any) {
      return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
          // Una vez que el usuario se registra, crea el documento del usuario en Firestore
          const userId = userCredential.user.uid;
          return this.createUserDocument(userId);
      });
  }

  loginWithGoogle() {
      return signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(async (userCredential) => {
          // Una vez que el usuario inicia sesión con Google, verifica si es la primera vez que se registra
          const userId = userCredential.user.uid;
          const userDoc = this.firestore.doc(`users/${userId}`);
          const snapshot = await firstValueFrom(userDoc.get());
          if (snapshot.exists) {
              // Si el documento del usuario ya existe, carga sus datos
              console.log('Usuario ya registrado'); // ver lógica cuando esté el modelo de recordatorios
          } else {
              // Si es la primera vez que se registra, crea el documento del usuario en Firestore
              await this.createUserDocument(userId);
          }
      });
  }  

  async login({ email, password }: any) {
      const loginResult = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario registrado'); // Cargar los recordatorios al iniciar sesión
      return loginResult;
  }

  logout() {
      return signOut(this.auth);
  }

  resetPassword(email:string){
      return sendPasswordResetEmail(this.auth, email)
  }

  // Crea el documento del usuario en Firestore
  private createUserDocument(userId: string) {
    const userDoc = this.firestore.doc(`users/${userId}`);
    return userDoc.set({});
  }

  // Guarda una alarma para el usuario logueado (se puede pasar a otro servicio capaz)
  addReminder(reminder: Reminder): Promise<void> {
    if (this.userId) {
      return this.alarmService.addReminder(this.userId, reminder);
    } else {
      throw new Error('No user is currently logged in.');
    }
  }

  // Obtiene las alarmas del usuario logueado (se puede pasar a otro servicio capaz)
  getReminders(): Observable<Reminder[]> {
    if (this.userId) {
      return this.alarmService.getReminders(this.userId);
    } else {
      throw new Error('No user is currently logged in.');
    }
  }
}
