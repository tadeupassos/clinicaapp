import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPacientePage } from './add-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: AddPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPacientePageRoutingModule {}
