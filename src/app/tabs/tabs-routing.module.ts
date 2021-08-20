import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      {
        path: 'atendimento/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../atendimento/atendimento.module').then( m => m.AtendimentoPageModule)
          }
        ]
      },
      {
        path: 'sessoes-passada',
        children: [
          {
            path: '',
            loadChildren: () => import('../sessoes-passada/sessoes-passada.module').then( m => m.SessoesPassadaPageModule)
          }
        ]
      },
      {
        path: 'prontuario/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../prontuario/prontuario.module').then( m => m.ProntuarioPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
