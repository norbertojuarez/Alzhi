import { Component,  Input, OnInit, input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Reminder } from 'src/app/models/reminder.models';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit  {
  @Input() reminder: Reminder = {
    id: '',
    name: '',
    date: new Date(),
    additionalData: ''
  };
  constructor(
    private userService:UserService,
    private alertController:AlertController) { }

  ngOnInit() {
    
  }
  async eliminarRecordatorio(id: string | undefined) {
    if (!id) {
      console.error('ID es undefined');
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este recordatorio?',
      cssClass: 'custom-alert', // Clase personalizada para el alert
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'custom-alert-button', // Clase personalizada para los botones
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          cssClass: 'custom-alert-button-eliminar', // Clase personalizada para los botones
          handler: () => {
            this.userService.removeReminder(id)
              .then(() => console.log('Recordatorio eliminado'))
              .catch(error => console.error(error));
          },
        },
      ],
    });
  
    await alert.present();
  }
}

