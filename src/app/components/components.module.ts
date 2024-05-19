import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ListasComponent } from './listas/listas.component';
import { AlarmComponent } from './alarm/alarm.component';
import { PipeModule } from '../pipes/pipe.module';


@NgModule({
  declarations: [
    ListasComponent,
    AlarmComponent    
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipeModule    
  ],
  exports: [
    ListasComponent,
    AlarmComponent  
  ]
})
export class ComponentsModule { }
