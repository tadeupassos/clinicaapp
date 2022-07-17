import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public pacienteId: string = null;
  public sessaoSubscription: Subscription;  
  public sessaoPorMesSubscription: Subscription;
  public sessoes = new Array<Sessao>();
  public nomePaciente = "";
  public atendimento = "";
  public nomePsicologo = "";
  public crp = "";
  public agrupadoData = [];

  qtdeAgendadas = 0;
  qtdeRealizadas = 0;

  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  mes = "";

  constructor(
    private navCtrl: NavController,
    private sessaoService: SessaoService,
    private alertController: AlertController
  ) {

    this.mes = this.meses[new Date().getMonth()];

    this.nomePsicologo = localStorage.getItem("nomePsicologo");
    this.crp = localStorage.getItem("crp");

    this.carregarSessoesAgendadas();
    this.carregarSessaoPorMes();

    //this.carregarSessoesPorCrp();

  }

  carregarSessoesAgendadas(){
    this.sessaoSubscription = this.sessaoService.getSessoesAgendadas(this.crp)
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

    })
  }

  setarData(sessoes: Array<Sessao>){
    sessoes.forEach(s => {

      let [dia,mes,ano] = s.dataSessao.split("/");
      s.dataSessaoStamp = new Date(Number(ano),Number(mes) - 1,Number(dia),0,0,0).getTime();

      this.sessaoService.updateSessao(s.id,s);
      console.log(s.dataSessaoStamp);
        
    });
  }

  carregarSessaoPorMes(){
    let agora = new Date();
    let mes = (agora.getMonth() + 1).toString();
    mes = mes.length == 1 ? "0" + mes : mes;
    let ano = agora.getFullYear().toString();

    this.sessaoPorMesSubscription = this.sessaoService.getSessoesPorMes(this.crp, mes, ano)
    .subscribe((res: Array<Sessao>) => {
      console.log("getSessoesPorMes",res);
      this.qtdeAgendadas = res.filter((f:Sessao) => { return f.frequencia == "" }).length;
      this.qtdeRealizadas = res.filter((f:Sessao) => { return f.frequencia != "" }).length;
    });
  }

  sair(){
    localStorage.clear();
    this.navCtrl.navigateRoot("/login");
  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
    if(this.sessaoPorMesSubscription) this.sessaoPorMesSubscription.unsubscribe();
  } 

  excluir(id:string){
    this.presentAlertConfirm(id)
  }

  async presentAlertConfirm(id:string) {
    const alert = await this.alertController.create({
      header: 'Tem certeza que deseja excluir!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log("id sessao",id);
            this.sessaoService.deleteSessao(id);
          }
        }
      ]
    });

    await alert.present();
  }

  carregarSessoesPorCrp(){
    this.sessaoService.getSessoesPorCrp(this.crp).subscribe((sessoes:Array<Sessao>) => {
      let agnaldo = sessoes.filter((s:Sessao) => { 
        return s.nomePaciente.toLowerCase().includes("agnaldo") && s.ano == "2022"
      }).sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });
      console.log("agnaldo",agnaldo);
    })
  }

}
