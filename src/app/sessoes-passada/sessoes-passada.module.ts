import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessoesPassadaPageRoutingModule } from './sessoes-passada-routing.module';

import { SessoesPassadaPage } from './sessoes-passada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessoesPassadaPageRoutingModule
  ],
  declarations: [SessoesPassadaPage]
})
export class SessoesPassadaPageModule {}
