import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public pacienteId: string = null;
  public sessaoSubscription: Subscription;  
  public sessaoPorMesSubscription: Subscription;
  public sessoes = new Array<Sessao>();
  public nomePaciente = "";
  public atendimento = "";
  public nomePsicologo = "";
  public crp = "";
  public agrupadoData = [];

  constructor(
    private navCtrl: NavController,
    private sessaoService: SessaoService,
    private alertController: AlertController
  ) {

    this.nomePsicologo = localStorage.getItem("nomePsicologo");
    this.crp = localStorage.getItem("crp");

    this.getSessoesSemProntuario();
  }

  getSessoesSemProntuario(){
    this.sessaoSubscription = this.sessaoService.getSessoesSemProntuario(this.crp)
    .subscribe((data: Array<Sessao>) => {
      this.sessoes = data;
      console.log("this.sessoes",this.sessoes);

      this.sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

      let grupo = this.sessoes.reduce((r, a) => {
        r[a.dataSessao] = [...r[a.dataSessao] || [], a];
        return r;
       }, {});

      this.agrupadoData = Object.entries(grupo);

      console.log("this.agrupadoData",this.agrupadoData);


    })
  }

}
