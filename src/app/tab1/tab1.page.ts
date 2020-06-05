import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public pacienteId: string = null;
  public sessaoSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public nomePaciente = "";
  public atendimento = "";
  public nomePsicologo = "";
  public crp = "";

  constructor(
    private navCtrl: NavController,
    private sessaoService: SessaoService,
  ) {

    this.nomePsicologo = localStorage.getItem("nomePsicologo");
    this.crp = localStorage.getItem("crp");

    console.log("nomePsicologo",this.nomePsicologo);

    this.sessaoSubscription = this.sessaoService.getSessoes(this.crp).subscribe(data => {
      //this.sessoes = data;
      this.sessoes = data.filter((f:Sessao) => {
        return f.frequencia == "";
      });
      console.log("this.sessoes",this.sessoes);

      this.sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

    });
  }

  sair(){
    localStorage.clear();
    this.navCtrl.navigateBack("/login");
  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
  } 

}
