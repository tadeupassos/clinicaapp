import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { NavController } from '@ionic/angular';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../interfaces/paciente';
import { ServicosService } from '../services/servicos.service';

@Component({
  selector: 'app-resumo',
  templateUrl: './resumo.page.html',
  styleUrls: ['./resumo.page.scss'],
})
export class ResumoPage implements OnInit {

  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  mesSelecionado = "";

  public pacienteId: string = null;
  public sessaoSubscription: Subscription; 
  public filtroSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public crp = "";

  particular: any = {
    sessoes: 0,
    valor: 0,
    subLocacao: 0
  }

  convenio: any = {
    sessoes: 0,
    valor: 0
  }

  qtdeSessoes = 0;
  total = 0;

  todasSessoes = new Array<Sessao>();

  dtInicio = "";
  dtFim = "";

  constructor(
    private navCtrl: NavController,
    private sessaoService: SessaoService,
    private pacienteService: PacienteService,
    private servicos: ServicosService
  ) {

    this.crp = localStorage.getItem("crp");
  }

  ngOnInit() {
    this.filtrarPorData();
  }

  async filtrarPorData(sel = false){

    let agora = new Date();
    let dataInicio: any;
    let dataFim: any;

    if(sel){
      // 2021-08-04
      let [ano,mes,dia] = this.dtInicio.split("-");
      dataInicio = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

      [ano,mes,dia] = this.dtFim.split("-");
      dataFim = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();
    }else{
      // 04/08/2021
      dataInicio = new Date(agora.getFullYear(),agora.getMonth(),1).getTime();
      dataFim = new Date(agora.getFullYear(),agora.getMonth() + 1,0).getTime();

      let [dia,mes,ano] = new Date(dataInicio).toLocaleDateString().split("/");
      this.dtInicio = [ano,mes,dia].join("-");

      [dia,mes,ano] = new Date(dataFim).toLocaleDateString().split("/");
      this.dtFim = [ano,mes,dia].join("-");
    }

    this.filtroSubscription = this.sessaoService.getSessoesPorData(this.crp,dataInicio,dataFim)
    .subscribe((resultado:Array<Sessao>) => {

      this.particular.sessoes = 0;
      this.particular.valor = 0;
      this.particular.subLocacao = 0;
    
      this.convenio.sessoes = 0,
      this.convenio.valor = 0
    
      this.qtdeSessoes = 0;
      this.total = 0;

      console.log("resultado",resultado);

      let convenio = resultado.filter((f:Sessao) => { return f.atendimento == "Convênio" });
      this.convenio.sessoes = convenio.length;
      convenio.forEach((c:Sessao) => {
        this.convenio.valor += Number(this.servicos.cobranca.Repasse.replace(",","."));
      });
  
      let particular = resultado.filter((f:Sessao) => { return f.atendimento == "Particular" });
      this.particular.sessoes = particular.length;
      particular.forEach((c:Sessao) => {
        this.particular.valor += Number(c.valor.replace(",","."));
        this.particular.subLocacao += Number(this.servicos.cobranca.Sublocacao.replace(",","."));
      });
  
      this.qtdeSessoes = this.convenio.sessoes + this.particular.sessoes;
      this.total = this.convenio.valor + this.particular.valor;
    })

    //const mesCorrente: Array<Sessao> = await this.sessaoService.getSessoesPorData(this.crp,dataInicio,dataFim).toPromise()

  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
    if(this.filtroSubscription) this.filtroSubscription.unsubscribe();
  }
}
