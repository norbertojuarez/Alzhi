import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFirestoreModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"ppii-541b0","appId":"1:1086346302985:web:e2800c9def5ecfbaf48ad8","storageBucket":"ppii-541b0.appspot.com","apiKey":"AIzaSyAHKg149Td_S-KXhtiF6pHoD37fbi1N3F0","authDomain":"ppii-541b0.firebaseapp.com","messagingSenderId":"1086346302985","measurementId":"G-NHYBPS8BC0"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"alarmas-57c4d","appId":"1:416128595356:web:d6b46af5ae783760be8459","storageBucket":"alarmas-57c4d.appspot.com","apiKey":"AIzaSyBRlKHYkuehStu-uQpn4VN8QFanrsyN3W8","authDomain":"alarmas-57c4d.firebaseapp.com","messagingSenderId":"416128595356"}))],
  bootstrap: [AppComponent],
})
export class AppModule {}
