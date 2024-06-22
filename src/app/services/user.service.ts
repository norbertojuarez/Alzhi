import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotificationService } from './notification.service';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/users.model';
import { Reminder } from '../models/reminder.models';
import { ToastController } from '@ionic/angular'; 
import 'firebase/compat/firestore'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: string | null = this.getUserId();

  constructor(
    private auth: Auth, 
    private firestore: AngularFirestore, 
    private notificationService: NotificationService,
    public toastController: ToastController,
    private router: Router
  ) { 
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

  // Guarda un usuario en Firestore
  addUser(user: User) {
    if (this.userId) {
      return this.firestore.collection('users').doc(this.userId).set({
        name: user.name,
        date: user.date,
        address: user.address,
        contact: {
          name: user.contact.name,
          phone: user.contact.phone
        }
      });
    } else {
      throw new Error('Ocurrió un error al guardar los datos del usuario');
    }
  }

  // Obtiene los datos del usuario autenticado desde Firestore
  getUser(): Observable<User> {
    if (this.userId) {
      return this.firestore.collection('users').doc<User>(this.userId).valueChanges().pipe(
        tap(user => {
          if (!user) {
            throw new Error('Usuario no encontrado');
          }
        }),
        map(user => {
          if (user) {
            return {
              name: user.name,
              date: user.date,
              address: user.address,
              contact: {
                name: user.contact.name,
                phone: user.contact.phone
              }
            };
          } else {
            throw new Error('Usuario no encontrado');
          }
        })
      );
    } else {
      throw new Error('Ocurrió un error al buscar los datos del usuario');
    }
  }

  getReminders(userId: string): Observable<Reminder[]> {
    if (userId) {
      return this.firestore.collection<Reminder>(`users/${userId}/reminders`).valueChanges({ idField: 'id' }).pipe(
        map(reminders => reminders.map(reminder => {
          return {
            ...reminder,
            date: this.convertTimestampToDate(reminder.date)
          };
        }))
      );
    } else {
      throw new Error('Ocurrió un error al buscar los datos del usuario');
    }
  }

  // Guarda una alarma para el usuario logueado
  async addReminder(userId: string, reminder: Reminder): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único para el documento
    const reminderWithId = { ...reminder, id }; // Agrega el ID al recordatorio
    return this.firestore.collection(`users/${userId}/reminders`).doc(id).set(reminderWithId)
      .then(() => {
        console.log("Document successfully written!");
        this.notificationService.scheduleNotification(id, reminder); // Programa la notificación después de guardar los datos
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  } 

  async removeReminder(id: string): Promise<void> {    
    if (!this.userId) {
      return Promise.reject('User ID is not available');
    }
    return this.firestore.collection(`users/${this.userId}/reminders`).doc(id).delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch(error => {
        console.error("Error deleting document: ", error);
      });
  }

  async presentToast(mensage:string) {
    let toast = await this.toastController.create({
      message: mensage,
      duration: 2000
    });
    toast.present();   
  }

  private convertTimestampToDate(timestamp: any): Date {
    const seconds = timestamp.seconds || 0;
    const nanoseconds = timestamp.nanoseconds || 0;
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);
    const date = new Date(milliseconds);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
  
}
