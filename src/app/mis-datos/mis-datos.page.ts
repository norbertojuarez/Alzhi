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
  currentUser: User | undefined;  
  disableSubmitButton: boolean = true; // Inicialmente deshabilitado

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder,    
  ) {
    // Initialize the form
    this.form = this.formBuilder.group({
      nombreCompleto: [this.currentUser?.name ],
      fechaNacimiento: [this.currentUser?.date || ''],
      direccion: [this.currentUser?.address || ''],
      contactoNombre: [this.currentUser?.contact?.name || ''],
      contactoTelefono: [this.currentUser?.contact?.phone || ''],     
      
    });
    this.form.valueChanges.subscribe(() => {
      this.validarFormulario();
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }
  ionViewWillEnter() {
    console.log("se muestra")
  }

  actualizarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remover caracteres que no sean dígitos

    // Limitar a 10 caracteres (dd-mm-aaaa)
    value = value.substring(0, 10);

    // Formatear la fecha dd-mm-aaaa
    if (value.length >= 8) {
      value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3');
    } else if (value.length >= 4) {
      value = value.replace(/(\d{2})(\d{2})/, '$1-$2-');
    } else if (value.length >= 2) {
      value = value.replace(/(\d{2})/, '$1-');
    }

    // Validar que los primeros dos dígitos sean del 01 al 31
    const dayPart = value.substring(0, 2);
    const parsedDay = parseInt(dayPart, 10);
    if (parsedDay < 1 || parsedDay > 31) {
      console.log('Día fuera de rango válido');
      input.value = input.value.slice(0, -1); // Eliminar el último carácter ingresado
      return;
    }

    // Validar que los próximos dos dígitos (mes) estén en el rango 01-12
    const monthPart = value.substring(3, 5);
    const parsedMonth = parseInt(monthPart, 10);
    if (parsedMonth < 1 || parsedMonth > 12) {
      console.log('Mes fuera de rango válido');
      input.value = input.value.slice(0, -1); // Eliminar el último carácter ingresado
      return;
    }

    // Validar que los últimos cuatro dígitos (año) estén entre 0001 y el año actual
    const yearPart = value.substring(6, 10);
    const parsedYear = parseInt(yearPart, 10);
    const currentYear = new Date().getFullYear();
    if (parsedYear < 1 || parsedYear > currentYear) {
      console.log('Año fuera de rango válido');
      input.value = input.value.slice(0, -1); // Eliminar el último carácter ingresado
      return;
    }

    // Actualizar el valor del campo fechaNacimiento en el formulario
    this.form.patchValue({
      fechaNacimiento: value
    });

    
    
  }

  validarFormulario() {
    const { nombreCompleto, fechaNacimiento, direccion, contactoNombre, contactoTelefono } = this.form.value;
    //this.disableSubmitButton = !(nombreCompleto && direccion && contactoNombre && contactoTelefono && fechaNacimiento.length !== 10);
    this.disableSubmitButton = !(nombreCompleto&& direccion&& contactoNombre&&contactoTelefono);
    console.log(this.disableSubmitButton)
    if(!this.disableSubmitButton){
     // Habilitar o deshabilitar el botón de guardar basado en la longitud de fechaNacimiento
     this.disableSubmitButton = fechaNacimiento.length !== 10;
    }else{
      console.log("la fecha no es correcta")
    }
  }
  createContactData(): Contact {
    return {
      name: this.form.get('contactoNombre')?.value,
      phone: this.form.get('contactoTelefono')?.value
    };
  }

  createUserData(): User {    
    return {
      name: this.form.get('nombreCompleto')?.value,
      date: this.form.get('fechaNacimiento')?.value,
      address: this.form.get('direccion')?.value,
      contact: this.createContactData()
    };
  }

  async onSubmit() {   
    // Validate form before submitting
    if (this.form.invalid) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    console.log(this.form.value);
    this.userService.addUser(this.createUserData())
      .then(async response => {
        const toast = await this.toastController.create({
          message: 'Los datos han sido guardados correctamente',
          duration: 2000,
          position: 'bottom',
          color: 'success'
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