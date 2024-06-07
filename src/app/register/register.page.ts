import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  showPassword = false;
  formReg: FormGroup;

  constructor(
    private userService : UserService,
    private router: Router,
    private toastController: ToastController  ){
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.register(this.formReg.value)
    .then(async response => {
      // Mostrar la alerta de registro exitoso
      const toast = await this.toastController.create({
        message: '¡Registro exitoso!',
        color: "success",
        duration: 2000, // Duración en milisegundos (en este caso, 4 segundos)
        position: 'bottom' //
      });

      await toast.present();

      // Redirigir al usuario a la página de inicio de sesión después de que el toast se haya mostrado
      toast.onDidDismiss().then(() => {
        this.router.navigate(['/mis-datos']);
      });
    })
    .catch(async error => {
      let mensajedeError: string = '';
      if (error.code === 'auth/email-already-in-use') {
        mensajedeError = 'Este correo electrónico ya está en uso';
      } else if (error.code === 'auth/invalid-email') {
          mensajedeError = 'Correo electrónico inválido';
      } else if (error.code === 'auth/weak-password') {
          mensajedeError = 'La contraseña debe tener al menos 6 caracteres';
      }
      const toast = await this.toastController.create({
        message: 'Correo electrónico o contraseña incorrectos',
        duration: 3000,
        position: 'bottom',
        color: 'light'
      });
      await toast.present();        
    });
  }

  togglePasswordVisibility(show: boolean) {
    this.showPassword = show;
  }

}
