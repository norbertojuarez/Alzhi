import { Component, OnInit } from '@angular/core';
import { FirestoreService, Reminder } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss'],
})
export class AlarmComponent implements OnInit {

  // Esto creo que podría ir en un model
  reminder: Reminder = {
    name: '',
    date: new Date(),
    additionalData: ''
  };

  constructor(
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {}

  addReminder() {
    this.firestoreService.addReminder(this.reminder).then(() => {
      console.log('Reminder added successfully.');
    }).catch(err => {
      console.error('Error adding reminder:', err);
    });    
  }

}
