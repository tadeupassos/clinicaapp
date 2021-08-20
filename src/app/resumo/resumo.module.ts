import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResumoPageRoutingModule } from './resumo-routing.module';
import { ResumoPage } from './resumo.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumoPageRoutingModule,
    BrMaskerModule
  ],
  declarations: [ResumoPage]
})
export class ResumoPageModule {}
