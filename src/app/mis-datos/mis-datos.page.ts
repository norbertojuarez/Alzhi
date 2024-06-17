import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        nombreCompleto: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        fechaNacimiento: ['', [Validators.required]],
        direccion: ['', Validators.required],
        contactoNombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        contactoTelefono: ['', [Validators.required, Validators.pattern('^[0-9]{2,12}$')]]
      });
  }

  ngOnInit(): void {
  }

  createContactData() {
    const contactName = this.form.get('contactoNombre')?.value;
    const contactPhone = this.form.get('contactoTelefono')?.value;
  
    const contact: Contact = {
      name: contactName,
      phone: contactPhone
    };
  
    return contact;
  }

  createUserData() {
    const userName = this.form.get('nombreCompleto')?.value;
    const userDate = this.form.get('fechaNacimiento')?.value;
    const userAddress = this.form.get('direccion')?.value;
    const userContact = this.createContactData();

    const user: User = {
      name: userName,
      date: userDate,
      address: userAddress,
      contact: userContact
    };

    return user; 
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
  
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
  }
}


