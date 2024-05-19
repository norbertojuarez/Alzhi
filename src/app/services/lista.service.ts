import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Lista } from '../models/lista.model';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  public listas: Lista[] = [];

  constructor(
    public alertController:AlertController,
    public toastController:ToastController
  ) {
    this.cargarStorage();
  }

  crearLista(nombreLista: string) {
    let ObjetoLista = new Lista(nombreLista);

    this.listas.push(ObjetoLista);
    this.guardarStorage(); 

    return ObjetoLista.titulo;
  }

  guardarStorage() {
    let stringListas: string = JSON.stringify(this.listas);
    localStorage.setItem('listas', stringListas); 
  }

  cargarStorage() {
    const listaStorage = localStorage.getItem('listas'); 
    if(listaStorage === null) {
      return this.listas = []; 
    }
    else {
      let objLista = JSON.parse(listaStorage); 
      return this.listas = objLista;
    }
  }

  editarLista(lista: Lista) {
    let listaEditar = this.listas.find((listaItem)=> listaItem.id == lista.id); 
    if(listaEditar) {
      listaEditar.titulo = lista.titulo;
    }

    this.guardarStorage();
  }

  eliminarLista(lista: Lista) {
    let nuevoListado = this.listas.filter((listaItem)=> listaItem.id !== lista.id); 
    this.listas = nuevoListado;
    this.guardarStorage();
  }

  validarInput(input: any):boolean {
    if(input && input.titulo) {
    return true;
    }
    this.presentToast('Debe ingresar un valor');
    return false; 
  }

  async presentToast(mensage:string) {
    let toast = await this.toastController.create({
      message: mensage,
      duration: 2000
    });

    toast.present();
  }

  obtenerLista(idLista: string | number) {
    const id = Number(idLista); 
    let lista = this.listas.find((itemLista)=> itemLista.id == id);
    return lista;
  }

}
