import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications'; 
import { Reminder } from '../models/reminder.models';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private plataform: Platform) {
    this.plataform.ready().then(() => {
      this.initializeNotification();
    });
  }

  async ngOnInit() {
    await LocalNotifications.requestPermissions();
  }

  // Crea un canal y acciones para la notificación de recordatorios
  private async initializeNotification() {
    LocalNotifications.createChannel({
      id: 'reminder',
      name: 'Recordatorios',
      description: 'Canal para recordatorios',
      sound: 'alarm.mp3',
      vibration: true,
      importance: 5,
      visibility: 1
    });
  } 

  // Programa una notificación de un recordatorio 
  public async scheduleNotification(id: string, reminder: Reminder) {
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
            allowWhileIdle: true   
          },
          smallIcon: 'ic_stat_access_alarms',
          iconColor: '#CBD5C0',
          channelId: 'reminder'
        }
      ]
    });
    console.log('Notificacion programada exitosamente');
  }
  
  // Identificador único para la notificación, Capacitor lo requiere
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
