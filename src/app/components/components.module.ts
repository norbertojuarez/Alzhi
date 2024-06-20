import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AlarmComponent } from './alarm/alarm.component';
import { CardsComponent } from './cards/cards.component';

@NgModule({
  declarations: [
    AlarmComponent,
    CardsComponent 
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    AlarmComponent ,
    CardsComponent
  ]
})
export class ComponentsModule { }
