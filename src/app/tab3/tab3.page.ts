import { Component } from '@angular/core';
import { ListaService } from '../services/lista.service'; 

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public listaService:ListaService,
  ) {}
  async AgregarLista(){
    let alerta = await this.listaService.alertController.create({
      header: "Agregar lista",
      inputs: [
        {
          type: "text",
          name: "titulo",
          placeholder: "Ingresar nombre de la lista"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Crear",
          handler: (data:any)=> {
            let esValido: boolean = this.listaService.validarInput(data);
            if (esValido){
              let creadaOk = this.listaService.crearLista(data.titulo);
              
              if(creadaOk) { 
                this.listaService.presentToast('Lista creada correctamente!');
              }
            }     
          }
        }
      ]
    })
    
    await alerta.present();
    console.log('Click en el botón');
  }
}
