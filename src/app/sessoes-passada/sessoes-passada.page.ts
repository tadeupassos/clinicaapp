import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SessaoService } from '../services/sessao.service';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';

@Component({
  selector: 'app-sessoes-passada',
  templateUrl: './sessoes-passada.page.html',
  styleUrls: ['./sessoes-passada.page.scss'],
})
export class SessoesPassadaPage implements OnInit {

  public sessaoSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
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
        return f.frequencia != "";
      });
      console.log("this.sessoes",this.sessoes);

      this.sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

    });
  }

  ngOnInit() {
  }

}
