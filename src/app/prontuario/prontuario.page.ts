import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Prontuario } from 'src/app/interfaces/prontuario';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { PacienteService } from 'src/app/services/paciente.service';
import { Paciente } from 'src/app/interfaces/paciente';

@Component({
  selector: 'app-prontuario',
  templateUrl: './prontuario.page.html',
  styleUrls: ['./prontuario.page.scss'],
})
export class ProntuarioPage implements OnInit {

  public numeroProntuario: number = 0;

  public fGroup: FormGroup;
  public paciente: Paciente = {};
  //private prontuario: Prontuario = {};
  private pacienteId: string = null;
  private pacienteSubscription: Subscription;    
  public loading: any;

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCrtl: ToastController,
  ) {   
    
    this.fGroup = this.fBuilder.group({
      'demanda': [''],
      'objetivos': [''],
      'evolucao': [''],
      'procedimentos': [''],
      'encaminhamento': ['']
    });       

    this.pacienteId = this.activeRoute.snapshot.params['id'];

    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId).subscribe(data => {
      this.paciente = data;
      this.numeroProntuario = this.paciente.prontuario.codigo;

      this.fGroup = this.fBuilder.group({
        'demanda': [this.paciente.prontuario.demanda],
        'objetivos': [this.paciente.prontuario.objetivos],
        'evolucao': [this.paciente.prontuario.evolucao],
        'procedimentos': [this.paciente.prontuario.procedimentos],
        'encaminhamento': [this.paciente.prontuario.encaminhamento]
      });       
    });
  } 

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
  }

  async salvarDados(){
    await this.presentLoading();
    this.paciente.prontuario = this.fGroup.value;

    try {
      await this.pacienteService.updatePaciente(this.pacienteId, this.paciente);
      await this.loading.dismiss();
      this.navCtrl.navigateBack('/tabs/tab2');
    } catch (error) {
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

}
