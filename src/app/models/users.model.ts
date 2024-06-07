import { Contact } from './contact.model';

export class User {

    // id: number; por ahora lo saco
    name: string;
    date: string; // ver más adelante de cambiarlo por formato Date
    address: string;
    contact: Contact;
  
    constructor(name: string, date: string, address: string, contact: Contact) {
      this.name = name;
      this.date = date;
      this.address = address;
      this.contact = contact;
    }
}