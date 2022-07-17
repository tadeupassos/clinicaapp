import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sessao } from '../interfaces/sessao';
import { SessaoService } from '../services/sessao.service';
import { NavController } from '@ionic/angular';
import { PacienteService } from '../services/paciente.service';
import { ServicosService } from '../services/servicos.service';
import { Convenio } from 'src/app/interfaces/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';

@Component({
  selector: 'app-resumo',
  templateUrl: './resumo.page.html',
  styleUrls: ['./resumo.page.scss'],
})
export class ResumoPage implements OnInit {

  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  mesSelecionado = "";

  public pacienteId: string = null;
  public filtroSubscription: Subscription;
  public filtroSubscriptionOld: Subscription;
  public sessoes = new Array<Sessao>();
  public sessoesOld = new Array<Sessao>();
  public crp = "";

  part: any = {
    sessoes: 0,
    valor: 0,
    subLocacao: 0,
    todos: [],
    falta: "",
    faltaJ: "",
    faltaT: "",
    faltaF: "",
  }

  conv: any = {
    sessoes: 0,
    valor: 0,
    todos: [],
    presenca: "",
    falta: "",
    faltaJ: "",
    faltaT: "",
    faltaF: "",
  }

  qtdeSessoes = 0;
  total = 0;

  todasSessoes = new Array<Sessao>();

  dtInicio = "";
  dtFim = "";
  filConvenio = "Todos"
  filtrado = {
    inicio: "",
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

    this.convenioSubscription = this.convenioService.getConvenios().subscribe((c: Array<Convenio>) => {
      this.convenios = c;
    });
  }

  ngOnInit() {
    this.filtrarPorData();
  }

  async filtrarPorData(sel = false) {

    console.log("this.dtInicio", this.dtInicio)

    let agora = new Date();
    let dataInicio: any;
    let dataFim: any;

    if (sel) {
      // 2021-08-04
      // let [ano,mes,dia] = this.dtInicio.split("-");
      // dataInicio = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

      // [ano,mes,dia] = this.dtFim.split("-");
      // dataFim = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();
    } else {
      // 04/08/2021
      dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1).getTime();
      dataFim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getTime();

      let [dia, mes, ano] = new Date(dataInicio).toLocaleDateString().split("/");
      this.dtInicio = [ano, mes, dia].join("-");

      [dia, mes, ano] = new Date(dataFim).toLocaleDateString().split("/");
      this.dtFim = [ano, mes, dia].join("-");
    }

    this.filtrado.inicio = this.dtInicio;
    this.filtrado.fim = this.dtFim;

    this.servicos.presentLoading2Seconds();

    this.filtroSubscription = this.sessaoService.getSessoesPorData(this.crp, this.dtInicio, this.dtFim, this.filConvenio)
      .subscribe((resultado: Array<Sessao>) => {
        this.todasSessoes = resultado;

        this.filtroSubscriptionOld = this.sessaoService.getSessoesPorData(this.crp, this.dtInicio, this.dtFim, this.filConvenio, true)
          .subscribe((resOld: Array<Sessao>) => {
            console.log("resOld",resOld);
            this.todasSessoes = this.todasSessoes.concat(resOld);

            this.todasSessoes.sort((a,b) => {
              let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
              let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
              return  dataCompletaA < dataCompletaB ? -1 : 1;
            });

            this.preparaResultado(this.todasSessoes);
        });
      });
  }

  preparaResultado(resultado: Array<Sessao>) {

    console.log("preparaResultado", resultado);

    let valorRepasse = Number(this.servicos.cobranca.Repasse.replace(",", "."));

    this.part.sessoes = 0;
    this.part.valor = 0;
    this.part.subLocacao = 0;

    this.conv.sessoes = 0,
      this.conv.valor = 0

    this.qtdeSessoes = 0;
    this.total = 0;

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // FREQUENCIAS DE CONVÊNIO
    this.conv.todos = resultado.filter((f: Sessao) => f.atendimento == "Convênio" && f.frequencia != "");
    console.log("sessoes conv",  this.conv.todos.length);

    this.conv.sessoes = this.conv.todos.length;
    this.conv.valor = this.conv.todos.length * valorRepasse;

    this.conv.faltaPaciente = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta Paciente").length;
    this.conv.faltaJustificadaPaciente = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta Justificada Paciente").length;

    // tratamento para falta do terapeuta
    this.conv.faltaTerapeuta = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta Terapeuta").length;
    let naoRepasse = this.conv.faltaTerapeuta * valorRepasse;
    this.conv.valor = this.conv.valor - naoRepasse;
    this.conv.sessoes = this.conv.sessoes - this.conv.faltaTerapeuta;

    this.conv.faltaJustificadaTerapeuta = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta Justificada Terapeuta").length;
    this.conv.recessosFeriados = this.conv.todos.filter((f: Sessao) => f.frequencia == "Recessos e Feriados").length;
    this.conv.manutencaoPredial = this.conv.todos.filter((f: Sessao) => f.frequencia == "Manutenção Predial").length;
    this.conv.reposicao = this.conv.todos.filter((f: Sessao) => f.frequencia == "Reposição").length;
    this.conv.presenca = this.conv.todos.filter((f: Sessao) => f.frequencia == "Presença").length;

    // Antigos
    this.conv.falta = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta").length;
    this.conv.faltaJ = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta Justificada").length;
    this.conv.faltaT = this.conv.todos.filter((f: Sessao) => f.frequencia == "Falta do Terapeuta").length;
    this.conv.faltaF = this.conv.todos.filter((f: Sessao) => f.frequencia == "Feriado").length;

    // FIM FREQUENCIAS DE CONVÊNIO
    /////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // FREQUENCIAS DE PARTICULAR
    this.part.todos = resultado.filter((f: Sessao) => f.atendimento == "Particular" && f.frequencia != "");
    console.log("sessoes part", this.part.todos.length);
    this.part.sessoes = this.part.todos.length;
    this.part.todos.map((c: Sessao) => {
      this.part.valor += Number(c.valor.replace(",", "."));
      this.part.subLocacao += Number(this.servicos.cobranca.Sublocacao.replace(",", "."));
    });

    this.part.faltaPaciente = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta Paciente").length;
    this.part.faltaJustificadaPaciente = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta Justificada Paciente").length;
    this.part.faltaTerapeuta = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta Terapeuta").length;
    this.part.faltaJustificadaTerapeuta = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta Justificada Terapeuta").length;
    this.part.recessosFeriados = this.part.todos.filter((f: Sessao) => f.frequencia == "Recessos e Feriados").length;
    this.part.manutencaoPredial = this.part.todos.filter((f: Sessao) => f.frequencia == "Manutenção Predial").length;
    this.part.reposicao = this.part.todos.filter((f: Sessao) => f.frequencia == "Reposição").length;
    this.part.presenca = this.part.todos.filter((f: Sessao) => f.frequencia == "Presença").length;

    // Antigos
    this.part.falta = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta").length;
    this.part.faltaJ = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta Justificada").length;
    this.part.faltaT = this.part.todos.filter((f: Sessao) => f.frequencia == "Falta do Terapeuta").length;
    this.part.faltaF = this.part.todos.filter((f: Sessao) => f.frequencia == "Feriado").length;

    // FIM FREQUENCIAS DE PARTICULAR
    /////////////////////////////////////////////////////////////////////////////////////////////////

    this.total = this.conv.valor + this.part.valor;
    this.qtdeSessoes = this.conv.sessoes + this.part.sessoes;

  }

  ngOndestroy() {
    if (this.filtroSubscription) this.filtroSubscription.unsubscribe();
    if (this.filtroSubscriptionOld) this.filtroSubscriptionOld.unsubscribe();
  }
}
