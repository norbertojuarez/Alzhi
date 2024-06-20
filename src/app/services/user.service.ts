import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { Haptics } from '@capacitor/haptics';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/users.model';
import { Contact } from '../models/contact.model';
import { Reminder } from '../models/reminder.models';
import { LocalNotifications } from '@capacitor/local-notifications'; 
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
    public toastController: ToastController,
    private router: Router
  ) { 
    this.auth.onAuthStateChanged(user => {
        this.userId = user ? user.uid : null;
    });
  }

  async ngOnInit() {
    await LocalNotifications.requestPermissions();
  }

  initializeNotificationListener() {
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      this.vibrar();
      console.log('Notificación recibida:');
      
    });
    // Si trabajamos con repeticiones
    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      console.log('Notificación lanzada:', notificationAction);
      if (notificationAction.actionId === 'CANCEL_REMINDER') {
        this.cancelReminder(notificationAction.notification.extra.reminderId);
        console.log('Notificación cancelada:', notificationAction);
      }
    });
  }

  vibrar() {
    Haptics.vibrate({ duration: 4000 });
    console.log('Vibrando');
  }

  getUserId(): string | null {
      return this.userId;
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

  private convertTimestampToDate(timestamp: any): Date {
    const seconds = timestamp.seconds || 0;
    const nanoseconds = timestamp.nanoseconds || 0;
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);
    const date = new Date(milliseconds);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
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
              this.router.navigate(['/tabs/']);
              console.log('Usuario ya registrado'); // ver lógica cuando esté el modelo de recordatorios              
          } else {
              // Si es la primera vez que se registra, crea el documento del usuario en Firestore
              await this.createUserDocument(userId);
              // y redirige al usuario a cargar sus datos
              this.router.navigate(['/mis-datos/']);
              

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
  // Guarda una alarma para el usuario logueado
   // Añade un recordatorio para un usuario específico (Subcolección dentro de la colección de usuarios - Relación de 1 a M)
  async addReminder(userId: string, reminder: Reminder): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único para el documento
    const reminderWithId = { ...reminder, id }; // Agrega el ID al recordatorio
    return this.firestore.collection(`users/${userId}/reminders`).doc(id).set(reminderWithId)
      .then(() => {
        console.log("Document successfully written!");
        this.scheduleNotification(id, reminder); // Programa la notificación después de guardar los datos
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
 
  
  // Programa una notificación de un recordatorio (Capacitor Local Notifications)
  private async scheduleNotification(id: string, reminder: Reminder) {
    console.log('Scheduling notification for:', reminder.name, 'at:', reminder.date);
  
    // Verificar permisos
    const permissions = await LocalNotifications.checkPermissions();
    if (permissions.display === 'granted') {
      // Si los permisos están concedidos, programar la notificación
      await this.schedule(id, reminder);
    } else {
      // Si no, solicitar permisos
      const requestResult = await LocalNotifications.requestPermissions();
      if (requestResult.display === 'granted') {
        // Si los permisos son concedidos después de la solicitud, programar la notificación
        await this.schedule(id, reminder);
      } else {
        // Manejar el caso cuando los permisos no son concedidos
        console.log('Permission was not granted.');
      }
    }
  }

  private async schedule(id: string, reminder: Reminder) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: reminder.name,
          body: reminder.additionalData,
          id: this.generateId(id),
          schedule: { 
            at: new Date(reminder.date),
            allowWhileIdle: true,
            repeats: true, // Sacar si no se quiere que se repita
            every: 'minute', // Sacar si no se quiere que se repita
            count: 3 // Sacar si no se quiere que se repita         
          },
          sound: 'default',
          smallIcon: 'res://drawable/alarma-icono', 
          actionTypeId: "CANCEL_REMINDER",
          extra: {
            reminderId: id
          }
        }
      ]
    });
    console.log('Notificacion programada exitosamente');
  }

  public async cancelReminder(idCancel: number) {
    await LocalNotifications.cancel({
      notifications: [
        {
          id: idCancel,
        },
      ],
    });

    console.log('Notificacion cancelada exitosamente');
  }
  
  // Identificador único para la notificación, Capacitor requiere un número entero
  private generateId(id: string): number {
    let hash = 0;
    if (id.length === 0) return hash;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  async presentToast(mensage:string) {
    let toast = await this.toastController.create({
      message: mensage,
      duration: 2000
    });

    toast.present();   
  }
}
