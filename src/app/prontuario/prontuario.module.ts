import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProntuarioPageRoutingModule } from './prontuario-routing.module';

import { ProntuarioPage } from './prontuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProntuarioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProntuarioPage]
})
export class ProntuarioPageModule {}
