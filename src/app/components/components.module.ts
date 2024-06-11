import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ListasComponent } from './listas/listas.component';
import { AlarmComponent } from './alarm/alarm.component';
import { PipeModule } from '../pipes/pipe.module';
import { CardsComponent } from './cards/cards.component';

@NgModule({
  declarations: [
    ListasComponent,
    AlarmComponent,
    CardsComponent 
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipeModule    
  ],
  exports: [
    ListasComponent,
    AlarmComponent ,
    CardsComponent
  ]
})
export class ComponentsModule { }
