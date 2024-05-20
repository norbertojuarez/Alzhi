// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';

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
    private firestore: AngularFirestore
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
}
