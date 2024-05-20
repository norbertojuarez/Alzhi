import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

// Se podría separar este servicio y el de alarmas capaz
export interface Reminder {
  id?: string;
  name: string;
  date: Date;
  additionalData: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore,
    public toastController:ToastController
  ) { }

  addReminder(reminder: Reminder): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único para el documento
    const reminderWithId = { ...reminder, id }; // Agregar el ID al recordatorio
    return this.firestore.collection('reminders').doc(id).set(reminderWithId)
      .then(() => {
        console.log("Document successfully written!");
        this.scheduleNotification(id, reminder); // Programar la notificación después de guardar los datos
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  } 

  getReminders(): Observable<Reminder[]> {
    return this.firestore.collection<Reminder>('reminders').valueChanges();
  }

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
