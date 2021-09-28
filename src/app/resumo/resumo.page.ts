import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { NavController } from '@ionic/angular';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../interfaces/paciente';
import { ServicosService } from '../services/servicos.service';
import { Convenio } from 'src/app/interfaces/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';

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
    subLocacao: 0,
    todos: []
  }

  convenio: any = {
    sessoes: 0,
    valor: 0,
    todos: []
  }

  qtdeSessoes = 0;
  total = 0;

  todasSessoes = new Array<Sessao>();

  dtInicio = "";
  dtFim = "";
  filConvenio = "Todos"
  filtrado = {
    inicio:  "",
    fim: ""
  }

  convenios = new Array<Convenio>();
  convenioSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private sessaoService: SessaoService,
    private pacienteService: PacienteService,
    private servicos: ServicosService,
    private convenioService: ConvenioService,
  ) {

    this.crp = localStorage.getItem("crp");

    this.convenioSubscription = this.convenioService.getConvenios().subscribe((c:Array<Convenio>) => {
      this.convenios = c;
    });
  }

  ngOnInit() {
    this.filtrarPorData();
  }

  async filtrarPorData(sel = false){

      console.log("this.dtInicio",this.dtInicio)

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

      this.filtrado.inicio = this.dtInicio;
      this.filtrado.fim = this.dtFim;

      this.filtroSubscription = this.sessaoService.getSessoesPorData(this.crp,dataInicio,dataFim,this.filConvenio)
      .subscribe((resultado:Array<Sessao>) => {
        this.todasSessoes = resultado;
        this.preparaResultado(resultado);
      })

      //const mesCorrente: Array<Sessao> = await this.sessaoService.getSessoesPorData(this.crp,dataInicio,dataFim).toPromise()

  }

  preparaResultado(resultado:Array<Sessao>){

    console.log("resultado",resultado);

    this.particular.sessoes = 0;
    this.particular.valor = 0;
    this.particular.subLocacao = 0;
  
    this.convenio.sessoes = 0,
    this.convenio.valor = 0
  
    this.qtdeSessoes = 0;
    this.total = 0;

    this.convenio.todos = resultado.filter((f:Sessao) => { return f.atendimento == "Convênio" });
    this.convenio.sessoes = this.convenio.todos.length;
    this.convenio.todos.forEach((c:Sessao) => {
      this.convenio.valor += Number(this.servicos.cobranca.Repasse.replace(",","."));
    });

    this.particular.todos = resultado.filter((f:Sessao) => { return f.atendimento == "Particular" });
    this.particular.sessoes = this.particular.todos.length;
    this.particular.todos.forEach((c:Sessao) => {
      this.particular.valor += Number(c.valor.replace(",","."));
      this.particular.subLocacao += Number(this.servicos.cobranca.Sublocacao.replace(",","."));
    });

    this.qtdeSessoes = this.convenio.sessoes + this.particular.sessoes;
    this.total = this.convenio.valor + this.particular.valor;
  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
    if(this.filtroSubscription) this.filtroSubscription.unsubscribe();
  }
}
