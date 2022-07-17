import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SessaoService } from '../services/sessao.service';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from '../interfaces/paciente';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sessoes-passada',
  templateUrl: './sessoes-passada.page.html',
  styleUrls: ['./sessoes-passada.page.scss'],
})
export class SessoesPassadaPage implements OnInit {

  public sessaoSubscription: Subscription; 
  public sessaoTempSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public nomePsicologo = "";
  public crp = "";
  public convenio = "";
  public nomePaciente = "";
  public numeroGuia = "";
  public pacienteId = "";
  public atendimento = "";
  //private paciente: Paciente = {};

  constructor(
    private navCtrl: NavController,
    private sessaoService: SessaoService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {

    this.activeRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.nomePsicologo = localStorage.getItem("nomePsicologo");
        this.crp = localStorage.getItem("crp");
        
        this.pacienteId = this.router.getCurrentNavigation().extras.state.id;
        this.convenio = this.router.getCurrentNavigation().extras.state.convenio;
        this.nomePaciente = this.router.getCurrentNavigation().extras.state.nome;
        
        console.log("this.pacienteId",this.pacienteId);
    
        this.sessaoSubscription = this.sessaoService.getSessoesPaciente(this.pacienteId)
        .subscribe((data:any) => {
          this.sessoes = data;
          console.log("data",data);
    
          this.sessoes.sort((a,b) => {
            let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
            let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
            return  dataCompletaA < dataCompletaB ? -1 : 1;
          });

          //this.alterarPresenca(this.sessoes);
        });
      }
  
    })

  }

  ngOnInit() {

  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
  }

  alterarPresenca(sessoes:any){
    // let sessao: Sessao = sessoes.filter(s => s.id == "DwnwFcK7JiXYqMMiSgrA"); 
    // console.log("sessao",sessao);
    // sessao.frequencia = "Falta";
    // sessao.conteudo = "";
    // sessao.evolucao = "";

    //this.sessaoService.updateSessao(sessao.id,sessao);

    // id do miguel souza "fWYTEaJozPHcyYVt8YdV"
    // dia da sessao  "DwnwFcK7JiXYqMMiSgrA"

    // this.sessaoTempSubscription = this.sessaoService.getSessao("DwnwFcK7JiXYqMMiSgrA").subscribe((sessao:Sessao) => {
    //   console.log("sessao",sessao);
    //   sessao.frequencia = "Falta";
    //   this.sessaoService.updateSessao(sessao.id,sessao);
    // });
  }


}
