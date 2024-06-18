import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { user } from '@angular/fire/auth';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private router: Router,
    private userService : UserService,
    
  ) {}

 onEdit(){
  this.router.navigate(['/mis-datos/']);
}

onLogout(){
  this.userService.logout(),
  console.log("sesion cerrada");
  this.router.navigate(['/login/']);
}
}