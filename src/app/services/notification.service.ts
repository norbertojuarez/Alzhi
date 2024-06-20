import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications'; 
import { Haptics } from '@capacitor/haptics';
import { Reminder } from '../models/reminder.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  async ngOnInit() {
    await LocalNotifications.requestPermissions();
  }

  public initializeNotificationListener() {
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      this.vibrar();
      console.log('Notificación recibida:', notification);
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

  // Programa una notificación de un recordatorio (Capacitor Local Notifications)
  public async scheduleNotification(id: string, reminder: Reminder) {
    // Verificar permisos
    const permissions = await LocalNotifications.checkPermissions();
    if (permissions.display === 'granted') {
      await this.schedule(id, reminder);
    } else {
      const requestResult = await LocalNotifications.requestPermissions();
      if (requestResult.display === 'granted') {
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

  private async cancelReminder(idCancel: number) {
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

  private vibrar() {
    Haptics.vibrate({ duration: 4000 });
    console.log('Vibrando');
  }
  
}
