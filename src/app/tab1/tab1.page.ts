import { Component } from '@angular/core';
import { UserService } from '../services/user.service'; 
import { User } from '../models/users.model';



@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {

  currentUser: User | undefined;

  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

}
