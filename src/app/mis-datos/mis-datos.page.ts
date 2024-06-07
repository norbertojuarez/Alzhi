import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/users.model';
import { Contact } from '../models/contact.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage implements OnInit {

  form: FormGroup;

  constructor ( 
    private userService : UserService,
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder)
    {
      this.form = this.formBuilder.group({
        nombreCompleto: [''],
        fechaNacimiento: [''],
        direccion: [''],
        contactoNombre: [''],
        contactoTelefono: ['']
      });
  }

  ngOnInit(): void {
  }

  createContactData() {
    const contact: Contact = {
      name: this.form.get('contactoNombre')?.value,
      phone: this.form.get('contactoTelefono')?.value
    };
    return contact;
  }


  createUserData() {
    const user: User = {
      name: this.form.get('nombreCompleto')?.value,
      date: this.form.get('fechaNacimiento')?.value,
      address: this.form.get('direccion')?.value,
      contact: this.createContactData()
    };
    return user; 
  }

  onSubmit() {
    this.userService.addUser(this.createUserData())
    .then(async response => {
      const toast = await this.toastController.create({
        message: 'Los datos han sido guardados correctamente',
        duration: 2000, 
        position: 'bottom',
        color: "success", 
      });
      await toast.present();
      toast.onDidDismiss().then(() => {
        this.router.navigate(['/tabs/tab1']);
      });
    })
    .catch(async error => {      
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        position: 'bottom',
        color: 'light'
      });
      await toast.present();        
    });
  }
}


