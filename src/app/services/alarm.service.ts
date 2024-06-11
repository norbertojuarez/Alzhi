import { Injectable} from '@angular/core';;
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Reminder } from '../models/reminder.models';
import { LocalNotifications } from '@capacitor/local-notifications'; 
import { ToastController } from '@ionic/angular'; 

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
 
  constructor(
    private firestore: AngularFirestore, 
    private toastController: ToastController

) { } 
 


 


 



}

