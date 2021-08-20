import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/services/paciente.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sessao } from 'src/app/interfaces/sessao';
import { LoadingController, ModalController } from '@ionic/angular';
import { SessaoService } from 'src/app/services/sessao.service';
import { Paciente } from 'src/app/interfaces/paciente';
import { ConvenioService } from '../services/convenio.service';
import { ServicosService } from '../services/servicos.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-sessao',
  templateUrl: './add-sessao.page.html',
  styleUrls: ['./add-sessao.page.scss'],
})
export class AddSessaoPage implements OnInit {

  @ViewChild('qtdeSessoes',{ static: true }) qtdeSessoes;
  @ViewChild('horario',{ static: true }) horario;

  public sessao: Sessao = {};
  public sessaoId: string = null;
  public pacientesSubscription: Subscription;
  public sessaoSubscription: Subscription;  
  public pacienteId = "";
  public nomePaciente = "";   
  public psicologo = "";
  public crp = "";
  public loading: any;
  public fGroup: FormGroup;

  pacientes = new Array<Paciente>(); 

  weekday = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  todasSessoes = new Array<Sessao>();

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private loadingCtrl: LoadingController,
    private sessaoService: SessaoService,
    private modalController: ModalController,
    private router: Router,
    private convenioService: ConvenioService,
    private servicos: ServicosService
  ) {

    this.psicologo = localStorage.getItem("nomePsicologo");
    this.crp = localStorage.getItem("crp");

    this.fGroup = this.fBuilder.group({
      'pacienteId' : ['', Validators.compose([Validators.required,])],
      'qtdeSessoes': ['', Validators.compose([Validators.required,])],
      'dataInicio': ['', Validators.compose([Validators.required,])],
      'dataFim': [''],
      'diaSemana': ['', Validators.compose([Validators.required,])],
      'hora': ['', Validators.compose([Validators.required,])]
    }); 

    this.fGroup.controls.qtdeSessoes.setValue('1');

    this.pegandoSessoes();

    this.sessaoId = this.activeRoute.snapshot.params['id'];
    if(this.sessaoId){
      this.sessaoService.getSessao(this.sessaoId).pipe(
        take(1)
      ).subscribe((s:Sessao) => {

        let [dia,mes,ano] =s.dataSessao.split("/");

        this.fGroup = this.fBuilder.group({
          'pacienteId' : [s.pacienteId, Validators.compose([Validators.required,])],
          'qtdeSessoes': ["1", Validators.compose([Validators.required,])],
          'dataInicio': [[ano,mes,dia].join("-"), Validators.compose([Validators.required,])],
          'dataFim': [''],
          'diaSemana': [s.diaSemana, Validators.compose([Validators.required,])],
          'hora': [s.horaSessao, Validators.compose([Validators.required,])]
        }); 
      });
    }

   }

  ngOnInit() {
    // this.pacienteSubscription = this.pacienteService.getPaciente(this.activeRoute.snapshot.params['id']).subscribe(p => {
    //   this.nomePaciente = p.nome;
    //   this.psicologo = p.psicologo;
    //   this.crp = p.crp;
    //   this.pacienteId = this.activeRoute.snapshot.params['id'];
    // });

    this.pacientesSubscription = this.pacienteService.getPacientes(this.crp).subscribe(data => {
      this.pacientes = data;
      this.pacientes.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });
      console.log("this.pacientes",this.pacientes);
    });
  }

  ngOndestroy() {
    if(this.pacientesSubscription) this.pacientesSubscription.unsubscribe();
  } 

  dataInicioMascara(event){

    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.dataInicio) ? this.fGroup.value.dataInicio : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.fGroup.get('dataInicio').setValue(data);
        return false
      }
    }

    if(this.fGroup.value.dataInicio.toString().length == 9){

      let dia = parseInt(this.fGroup.value.dataInicio.substr(0,2));
      let mes = parseInt(this.fGroup.value.dataInicio.substr(3,2));
      let ano = parseInt(this.fGroup.value.dataInicio.substr(6,4));
      let d  = new Date(ano,mes - 1,dia,0,0,0);

      //this.fGroup.value.diaSemana = this.weekday[d.getDay()- 1];
      this.fGroup.controls.diaSemana.setValue(this.weekday[d.getDay() - 1]);

      this.horario.setFocus();
    }
  }

  dataFimMascara(event){

    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.dataFim) ? this.fGroup.value.dataFim : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.fGroup.get('dataFim').setValue(data);
        return false
      }
    }
  }
  
  horaFormato(event){
    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.hora) ? this.fGroup.value.hora : "";

      if(data.length == 1){
        data = data + digito + ":";
        
        this.fGroup.get('hora').setValue(data);
        return false
      }
    }
  }

  geraDataFim(){

    console.log("this.fGroup.value.dataInicio",this.fGroup.value.dataInicio);

    // let dia = parseInt(this.fGroup.value.dataInicio.substr(0,2));
    // let mes = parseInt(this.fGroup.value.dataInicio.substr(3,2));
    // let ano = parseInt(this.fGroup.value.dataInicio.substr(6,4));

    let [ano, mes, dia] = this.fGroup.value.dataInicio.split("-");
    let d  = new Date(ano,mes - 1,dia,0,0,0);
    console.log("d.getDay()",d.getDay());

    this.fGroup.controls.diaSemana.setValue(this.weekday[d.getDay()]);

    let data: string = (this.fGroup.value.dataInicio) ? this.fGroup.value.dataInicio : "";
    let qtdeSessoes: number = (this.fGroup.value.qtdeSessoes) ? parseInt(this.fGroup.value.qtdeSessoes) : 0;

    //this.horario.setFocus();

    if(data){

      // if(qtdeSessoes <= 0 ){
      //   this.fGroup.controls.qtdeSessoes.setErrors({ required: true });
      //   this.qtdeSessoes.setFocus();
      // }else if(qtdeSessoes == 1){
      //   this.fGroup.get('dataFim').setValue(this.fGroup.value.dataInicio);
      // }else{
        
      //   let dia = parseInt(this.fGroup.value.dataInicio.substr(0,2));
      //   let mes = parseInt(this.fGroup.value.dataInicio.substr(3,2));
      //   let ano = parseInt(this.fGroup.value.dataInicio.substr(6,4));
      //   let dataGerada  = new Date(ano,mes - 1,dia,0,0,0);
      //   //console.log("data Iniciio:", dataGerada);

      //   let subtrair = (qtdeSessoes == 1) ? 0 : 1;

      //   let qtdeDias = (qtdeSessoes - subtrair) * 7;
      //   dataGerada.setDate(dataGerada.getDate() + qtdeDias);
      //   //console.log("data fim:", dataGerada.toLocaleDateString());
      //   this.fGroup.get('dataFim').setValue(dataGerada.toLocaleDateString());
      //   //console.log("ultimaDataSessao:",dataGerada.toLocaleDateString());
      // }
    }
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
    return this.loading.present();
  }
  
  async salvarDados() {

    console.log("this.verificaHorario()",this.verificaHorario())

    if(this.verificaHorario()){
      this.servicos.presentToast('Ops... Já existe agenda para este horário!',3000);
    }else{
      await this.presentLoading();

      let [ano, mes, dia] = this.fGroup.value.dataInicio.split("-");
  
      let hora = parseInt(this.fGroup.value.hora.substr(0,2));
      let minuto = parseInt(this.fGroup.value.hora.substr(3,2));
  
      let dataGerada  = new Date(ano,mes - 1,dia,hora,minuto,0);
      this.pacienteId = this.fGroup.value.pacienteId;
      this.nomePaciente = this.pacientes.find(p => p.id == this.pacienteId).nome;
  
      let atendimento = this.pacientes.find(p => p.id == this.pacienteId).atendimento;
      let nomeConvenio = "";
      let valor = ""

      if(atendimento == "Particular"){
        valor = this.pacientes.find(p => p.id == this.pacienteId).valor;
      }else{
        nomeConvenio = this.pacientes.find(p => p.id == this.pacienteId).convenio;
        valor = this.pacientes.find(p => p.id == this.pacienteId).valor;
      }

      let sessao: Sessao = {
        pacienteId: this.pacienteId,
        nomePaciente: this.nomePaciente,
        numeroGuia: "",
        psicologo: this.psicologo,
        crp: this.crp,
        dataSessao: dia.toString() + "/" + mes.toString() + "/" + ano.toString(),
        dataSessaoStamp: new Date(Number(ano),Number(mes) - 1,Number(dia),0,0,0).getTime(),
        diaSemana: this.fGroup.value.diaSemana,
        dia: dia.toString(),
        mes: mes.toString(),
        ano: ano.toString(),
        horaSessao: this.fGroup.value.hora,
        frequencia: "",
        conteudo: "",
        evolucao: "",
        userId: "100",
        atendimento,
        valor,
        nomeConvenio
      }

      console.log("sessao",sessao);

      try {

        if(this.sessaoId){
          await this.sessaoService.updateSessao(this.sessaoId,sessao);
        }else{
          await this.sessaoService.addSessao(sessao);
        }

        await this.loading.dismiss();
        this.router.navigate(['/tabs/tab1']);
  
        for (let index = 2; index <= parseInt(this.fGroup.value.qtdeSessoes); index++) {
  
          let proximaData = dataGerada.setDate(dataGerada.getDate() + 7);
          let dia = new Date(proximaData).getDate();
          let mes = new Date(proximaData).getMonth() + 1;
          let ano = new Date(proximaData).getFullYear();
  
          let sessao: Sessao = {
            pacienteId: this.pacienteId,
            nomePaciente: this.nomePaciente,
            numeroGuia: "",
            psicologo: this.psicologo,
            crp: this.crp,
            dataSessao: dia + "/" + mes + "/" + ano,
            diaSemana: this.fGroup.value.diaSemana,
            dia: dia.toString(),
            mes: mes.toString(),
            ano: ano.toString(),       
            horaSessao: this.fGroup.value.hora,
            frequencia: "",
            conteudo: "",
            evolucao: "",
            userId: "100"
          }
          try {
            await this.sessaoService.addSessao(sessao);
            //await this.modalController.dismiss();
            //console.log("sessao " + index + ":", JSON.stringify(sessao));
          } catch (error) {
            console.log("addSessao(sessao) " + index + ":",error);
          }
        }
      } catch (error) {
        console.log("addSessao(sessao) 1:",error);
      }
    }
  }  

  // async closeModal() {
  //   await this.modalController.dismiss();
  // }

  pegaData(){
    console.log("this.fGroup.value.dataInicio",this.fGroup.value.dataInicio);
  }

  verificaHorario(){
    let [ano, mes, dia] = this.fGroup.value.dataInicio.split("-");
    let data = [dia,mes,ano].join("/");
    let mesmasDataHora = this.todasSessoes.filter((s:Sessao) => { 
      return s.dataSessao == data && s.horaSessao == this.fGroup.value.hora 
    }).length;
    return mesmasDataHora > 0;
  }

  pegandoSessoes(){
    this.sessaoSubscription = this.sessaoService.getSessoesAgendadas(this.crp)
    .subscribe((data: Array<Sessao>) => {
      this.todasSessoes = data;
    });
  }
  

}
