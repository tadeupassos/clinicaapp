import { Component, OnInit } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { Subscription } from 'rxjs';
import { SessaoService } from '../services/sessao.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Paciente } from 'src/app/interfaces/paciente';
import { PacienteService } from '../services/paciente.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.page.html',
  styleUrls: ['./atendimento.page.scss'],
})
export class AtendimentoPage implements OnInit {

  public fGroup: FormGroup;

  public sessao: Sessao = {};
  public sessaoId: string = null;
  public sessaoSubscription: Subscription;  
  public numeroGuia = "";
  private paciente: Paciente = {};
  private pacienteSubscription: Subscription;  

  public mostrarCampoOutros: boolean = false;
  public mostrarConteudoEvolucao: boolean = false;
  public loading: any;

  constructor(
    private fBuilder: FormBuilder,
    private sessaoService: SessaoService,
    private activeRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCrtl: ToastController,
    private pacienteService: PacienteService,
  ) { 

    this.fGroup = this.fBuilder.group({
      'frequencia': [this.sessao.frequencia, Validators.compose([Validators.required])],
      'conteudo': [this.sessao.conteudo],
      'evolucao': [this.sessao.evolucao],
      'outros': [this.sessao.outros]
    });

    this.fGroup.get("conteudo").valueChanges.subscribe(item => {
      console.log("campoOutros",item);

      if(item == "Outros"){
        this.mostrarCampoOutros = true;
        this.fGroup.controls["outros"].setValidators([Validators.required]);
        this.fGroup.controls["outros"].updateValueAndValidity();
      }else{
        this.mostrarCampoOutros = false;
        this.fGroup.controls["outros"].clearValidators();
        this.fGroup.controls["outros"].updateValueAndValidity();
      }
    });

    this.fGroup.get("frequencia").valueChanges.subscribe(item => {
      console.log("frequencia",item);
      if(item == "Presença"){
        this.fGroup.controls["conteudo"].setValidators([Validators.required]);
        this.fGroup.controls["conteudo"].updateValueAndValidity();
        this.fGroup.controls["evolucao"].setValidators([Validators.required]);
        this.fGroup.controls["evolucao"].updateValueAndValidity();
        this.mostrarConteudoEvolucao = true;
      }else{
        this.fGroup.controls["conteudo"].clearValidators();
        this.fGroup.controls["conteudo"].updateValueAndValidity();
        this.fGroup.controls["evolucao"].clearValidators();
        this.fGroup.controls["evolucao"].updateValueAndValidity();
        this.mostrarConteudoEvolucao = false;
      }
    });    

    this.sessaoId = this.activeRoute.snapshot.params['id'];
    this.sessaoSubscription = this.sessaoService.getSessao(this.sessaoId).subscribe(data => {
      this.sessao = data;
      this.numeroGuia = this.sessao.numeroGuia;
      console.log("this.sessao",this.sessao);

      this.pacienteSubscription = this.pacienteService.getPaciente(this.sessao.pacienteId).subscribe(data => {
        this.paciente = data;
      });

      // this.fGroup = this.fBuilder.group({
      //   'frequencia': [this.sessao.frequencia, Validators.compose([Validators.required,])],
      //   'conteudo': [this.sessao.conteudo, Validators.compose([Validators.required,])],
      //   'evolucao': [this.sessao.evolucao, Validators.compose([Validators.required,])]
      // });
    });
  }

  ngOnInit() {

  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
  } 

  async salvarDados(){
    if(this.fGroup.value.frequencia == "Presença"){

    }

    await this.presentLoading();

    this.sessao.frequencia = this.fGroup.value.frequencia;
    this.sessao.conteudo = this.fGroup.value.conteudo;
    this.sessao.evolucao = this.sessao.dataSessao + " - " + this.fGroup.value.evolucao;
    this.sessao.outros = this.fGroup.value.outros;
    this.sessao.userId = "100";  

    try {
      await this.sessaoService.updateSessao(this.sessaoId, this.sessao);
      await this.loading.dismiss();

      this.atualizaProntuario();

      this.navCtrl.navigateBack('/tabs/tab1');
    }catch(error) {
      this.presentToast('Erro ao tentar salvar');
      this.loading.dismiss();
    }
  }

  public async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
    return this.loading.present();
  }

  public async presentToast(message: string){
    const toast = await this.toastCrtl.create({ message,  duration: 2000 });
    toast.present();
  }

  atualizaProntuario(){
    this.paciente.prontuario.evolucao += this.sessao.evolucao + ";\n";
    this.pacienteService.updatePaciente(this.sessao.pacienteId, this.paciente);
  }


}
