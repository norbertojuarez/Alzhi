import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Reminder } from '../../models/reminder.models';


@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss'],
})
export class AlarmComponent implements OnInit {
  @Output() CancelAlarm: EventEmitter<void> = new EventEmitter<void>();
  reminder: Reminder;
  selectedDate: string =""; // Variable adicional para almacenar la fecha seleccionada
  isoDate: string ="";  
  constructor( private userService: UserService,   ) {
  this.reminder = {
    name: '',
    date: new Date(),
    additionalData: ''
  };      
  }
  ngOnInit() { 
   this.inicializarComponente();   
  }

  public inicializarComponente(){    
    // Normaliza la fecha a formato ISO 8601
  if (typeof this.reminder.date === 'string') {       
    // this.isoDate = this.reminder.date;
    console.log("esta en string") //nunca es string en esta instancia 
  }else {    
     // Obtener la diferencia horaria actual en minutos
     const offsetMinutes = this.reminder.date.getTimezoneOffset();
     // Convertir la diferencia horaria a milisegundos (1 minuto = 60000 milisegundos)
     const offsetMilliseconds = offsetMinutes * 60000;
      // Restar la diferencia horaria a la fecha UTC para obtener la hora local
     this.reminder.date = new Date(this.reminder.date.getTime() - offsetMilliseconds);      
     // Si es un objeto Date, conviértelo a una cadena ISO 8601
     this.isoDate = new Date(this.reminder.date).toISOString();    
     this.reminder.date = this.isoDate;
     console.log("componente inicializado")
   }
  }
  CancelReminder() {
    this.CancelAlarm.emit();
  }
  async addReminder() {
    if (!this.reminder.name || !this.reminder.additionalData || !this.reminder.date) {
      console.error('Error: Todos los campos son obligatorios');
      const toast = await this.userService.toastController.create({
        message: 'Por favor, completa todos los campos',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }       
     // Convierte la fecha en formato ISO 8601 a un objeto Date
     const dateObject = new Date(this.reminder.date);

     // Suma 3 horas a la fecha actual (para Firebase)
     dateObject.setHours(dateObject.getHours() + 3);

    const userId = this.userService.getUserId();
    if (userId === null) {
      console.error('Error: User ID is null');
      return;
    }      
    
     // Asigna la fecha convertida a reminder.date
     this.reminder.date = dateObject;

    this.userService.addReminder(userId, this.reminder).then(() => {
     this.userService.presentToast('Alarma creada correctamente!');
      console.log('Reminder added successfully.');
    }).catch(err => {
      console.error('Error adding reminder:', err);
    });     
    this.CancelReminder()      
  }

  updateSelectedDate(event: CustomEvent) {
    const selectedDate = new Date(event.detail.value); // Convierte la cadena de fecha y hora en un objeto Date
    selectedDate.setHours(selectedDate.getHours() - 3) // Resta 3 horas para poder mostrar en calendario
    this.reminder.date = selectedDate; // Actualiza reminder.date con el objeto Date   
    this.isoDate = new Date(this.reminder.date).toISOString(); //Vuelve a pasar a String la fecha para calendario
    this.reminder.date = this.isoDate; //Asigno la fecha en formato String
    console.log("fecha actualizada")
  }
}
