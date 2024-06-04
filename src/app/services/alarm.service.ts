import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Reminder } from '../models/reminder.models';
import { LocalNotifications } from '@capacitor/local-notifications'; 
import { ToastController } from '@ionic/angular'; 

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  constructor(private firestore: AngularFirestore, private toastController: ToastController) { }

  // Añade un recordatorio para un usuario específico (Subcolección dentro de la colección de usuarios - Relación de 1 a M)
  addReminder(userId: string, reminder: Reminder): Promise<void> {
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

  // Obtiene los recordatorios de un usuario específico
  getReminders(userId: string): Observable<Reminder[]> {
    return this.firestore.collection<Reminder>(`users/${userId}/reminders`).valueChanges();
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
          schedule: { at: new Date(reminder.date) },
          actionTypeId: "",
          extra: null
        }
      ]
    });
    console.log('Notification scheduled successfully');
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

