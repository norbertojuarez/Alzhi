import { Component, OnInit, ViewChild} from '@angular/core';
import { Reminder } from '../models/reminder.models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{  
  isAlarmActive: boolean = false;
  reminders: Reminder[] = [];
  userId: string | null = null;
  constructor(
    private userService: UserService

  ) {}
  
  ngOnInit() {       
    this.userId = this.userService.getUserId();
    if (this.userId) {
      this.loadReminders(this.userId);
    } else {
      console.error('User ID is not available');  
    }  
  }  

  loadReminders(userId: string){
  // Obtener los recordatorios del servicio
  this.userService.getReminders(userId).subscribe(reminders => {
    this.reminders = reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });
  }
  AgregarNuevoRecordatorio() {          
      this.isAlarmActive = true;       
  }
  
  handleCancelAlarm(){
    this.isAlarmActive = false;
  }
}
