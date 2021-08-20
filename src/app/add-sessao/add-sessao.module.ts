import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSessaoPageRoutingModule } from './add-sessao-routing.module';

import { AddSessaoPage } from './add-sessao.page';

import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSessaoPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule
    
  ],
  declarations: [AddSessaoPage]
})
export class AddSessaoPageModule {}
