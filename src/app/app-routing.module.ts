import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule", canActivate: [AuthGuard] },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule", canActivate: [LoginGuard] },
  {
    path: 'add-sessao',
    loadChildren: () => import('./add-sessao/add-sessao.module').then( m => m.AddSessaoPageModule)
  },
  {
    path: 'add-sessao/:id',
    loadChildren: () => import('./add-sessao/add-sessao.module').then( m => m.AddSessaoPageModule)
  },
  {
    path: 'add-paciente',
    loadChildren: () => import('./add-paciente/add-paciente.module').then( m => m.AddPacientePageModule)
  },
  {
    path: 'add-paciente/:id',
    loadChildren: () => import('./add-paciente/add-paciente.module').then( m => m.AddPacientePageModule)
  },
  {
    path: 'resumo',
    loadChildren: () => import('./resumo/resumo.module').then( m => m.ResumoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
