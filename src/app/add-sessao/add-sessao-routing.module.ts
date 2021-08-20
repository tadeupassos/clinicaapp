import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSessaoPage } from './add-sessao.page';

const routes: Routes = [
  {
    path: '',
    component: AddSessaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSessaoPageRoutingModule {}
