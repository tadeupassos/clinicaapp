import { Component } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public sessaoSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public crp = "";

  constructor(
    private sessaoService: SessaoService,
  ) {
    this.crp = localStorage.getItem("crp");

    this.sessaoSubscription = this.sessaoService.getSessoes(this.crp).subscribe(data => {
      // Fazendo algo semelhante a um distinct
      this.sessoes = data.filter((thing, index, self) => index === self.findIndex((e:any) => (
          e.pacienteId === thing.pacienteId
      )));
      console.log("this.pacientes",this.sessoes);

      this.sessoes.sort((a,b) => {
        return  a.nomePaciente < b.nomePaciente ? -1 : 1;
      });

    });

  }

}
