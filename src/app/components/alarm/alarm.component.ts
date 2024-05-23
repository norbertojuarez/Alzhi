import { Component, OnInit } from '@angular/core';
import { AlarmService } from 'src/app/services/alarm.service';
import { UserService } from 'src/app/services/user.service';
import { Reminder } from '../../models/reminder.models';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss'],
})
export class AlarmComponent implements OnInit {

  reminder: Reminder;

  constructor(
    private userService: UserService,
    private alarmService: AlarmService
  ) {
    this.reminder = {
      name: '',
      date: new Date(),
      additionalData: ''
    };
  }

  ngOnInit() {}

  addReminder() {
    const userId = this.userService.getUserId();
    if (userId === null) {
      console.error('Error: User ID is null');
      return;
    }
    this.alarmService.addReminder(userId, this.reminder).then(() => {
      this.alarmService.presentToast('Alarma creada correctamente!');
      console.log('Reminder added successfully.');
    }).catch(err => {
      console.error('Error adding reminder:', err);
    });    
  }

}
