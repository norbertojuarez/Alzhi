import { Component } from '@angular/core';


export interface Contact {
  nombre: string;
  telefono: string;  
} 


export interface User {
  id: number;
  name: string;
  date: string;
  adress: string;
  contact: Contact;  
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {

  constructor() {}
  
  currentUser: User = {
    id: 1,
    name: 'John Doe',
    date: '1925-01-01',
    adress: 'Calle 123, 4567890',
    contact: {
      nombre: 'Juan Perez',
      telefono: '1234567890'
    }
  };

}
