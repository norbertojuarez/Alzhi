// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

  constructor(private firestore: AngularFirestore) { }

  addReminder(reminder: Reminder): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('reminders').doc(id).set({ ...reminder, id });
  }

  getReminders(): Observable<Reminder[]> {
    return this.firestore.collection<Reminder>('reminders').valueChanges();
  }
}
