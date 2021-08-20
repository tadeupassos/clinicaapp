import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Paciente } from 'src/app/interfaces/paciente';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { Convenio } from 'src/app/interfaces/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';
import { PsicologoService } from 'src/app/services/psicologo.service';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { Prontuario } from 'src/app/interfaces/prontuario';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.page.html',
  styleUrls: ['./add-paciente.page.scss'],
})
export class AddPacientePage implements OnInit {
  public fGroup: FormGroup;
  public mostrarSpinner: boolean = false;
  public mostraErroConvenio: boolean = false;
  public mostraErroValor: boolean = false;
  public mostrarBotaoExcluir: boolean = false;

  private paciente: Paciente = {};
  private pacienteId: string = null;
  private codigoProntuarioId: string = null;
  private pacienteSubscription: Subscription;  
  private pacientesSubscription: Subscription;
  private codigoSubscription: Subscription;  

  public convenios = new Array<Convenio>();
  private convenioSubscription: Subscription;
  
  public psicologos = new Array<Psicologo>();
  private psicologoSubscription: Subscription;    

  public novoCodigo: number;

  crp = "";
  nomePsicologo = "";

  constructor(
    private fBuilder: FormBuilder, 
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private navCtrl: NavController,
    private servicos: ServicosService,
    private convenioService: ConvenioService,
    private psicologoService: PsicologoService
  ) {

    this.crp = localStorage.getItem("crp");
    this.nomePsicologo = localStorage.getItem("nomePsicologo");

    this.convenioSubscription = this.convenioService.getConvenios().subscribe(data => {
      this.convenios = data;
      //console.log(data);
    });

    this.fGroup = this.fBuilder.group({
      'dataInicio': [this.paciente.dataInicio, Validators.compose([Validators.required])],
      'atendimento': [this.paciente.atendimento, Validators.compose([Validators.required])],
      'convenio': [this.paciente.convenio],
      'valor': [this.paciente.valor],
      'dataEncerrou': [this.paciente.dataEncerrou],
      'motivoEncerrou': [this.paciente.motivoEncerrou],
      'nome': [this.paciente.nome, Validators.compose([Validators.required,])],
      'email': [this.paciente.email], //Validators.compose([Validators.required,Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)])],
      'dataNascimento': [this.paciente.dataNascimento, Validators.compose([Validators.required])],
      'celular1': [this.paciente.celular1, Validators.compose([Validators.required])],
      'celular2': [this.paciente.celular2],
      'telefone': [this.paciente.telefone],
      'responsaveis': [this.paciente.responsaveis],
      'cep': [this.paciente.cep, Validators.compose([Validators.required,Validators.minLength(8)])],
      'cidade': [this.paciente.cidade, Validators.compose([Validators.required])],
      'endereco': [this.paciente.endereco, Validators.compose([Validators.required])],
      'bairro': [this.paciente.bairro, Validators.compose([Validators.required])],
      'numero': [this.paciente.numero, Validators.compose([Validators.required])],
      'complemento': [this.paciente.complemento],
      'psicologo': [this.paciente.psicologo],
      'crp': [this.paciente.crp]
    });

    this.fGroup.controls.atendimento.setValue('Convênio');
    this.fGroup.controls.psicologo.setValue(this.nomePsicologo);
    this.fGroup.controls.crp.setValue(this.crp);
    
    this.pacienteId = this.activeRoute.snapshot.params['id'];
    if(this.pacienteId){
      this.loadPaciente();
    }else{
      this.codigoSubscription = this.pacienteService.getCodigoProntuario().subscribe((c:any) => {
        this.novoCodigo = c[0].valor + 1;
        this.codigoProntuarioId = c[0].id;
        console.log("novoCodigo:",this.novoCodigo);
      })
    }
       
  }

  ngOnInit() {
    // this.fGroup.get("psicologo").valueChanges.subscribe(item => {
    //   let nomes = this.psicologos;
    //   nomes.filter(c => {
    //     return c.nome == item;
    //   }).map(c => {
    //     this.fGroup.get("crp").setValue(c.crp);
    //     console.log("mudou psicologo",c.crp)
    //   });
    // });

  }

  ngOndestroy() {
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
    if(this.pacientesSubscription) this.pacientesSubscription.unsubscribe();
    this.convenioSubscription.unsubscribe();
    this.psicologoSubscription.unsubscribe();
    this.codigoSubscription.unsubscribe();
  }

  loadPaciente(){
    this.mostrarBotaoExcluir = false;
    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId).subscribe(data => {
      this.paciente = data;
      
      console.log("this.paciente",this.paciente);

      this.fGroup = this.fBuilder.group({
        'dataInicio': [this.paciente.dataInicio, Validators.compose([Validators.required])],
        'atendimento': [this.paciente.atendimento, Validators.compose([Validators.required])],
        'convenio': [this.paciente.convenio],
        'valor': [this.paciente.valor],
        'dataEncerrou': [this.paciente.dataEncerrou],
        'motivoEncerrou': [this.paciente.motivoEncerrou],
        'nome': [this.paciente.nome, Validators.compose([Validators.required,])],
        'email': [this.paciente.email], //Validators.compose([Validators.required,Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)])],
        'dataNascimento': [this.paciente.dataNascimento, Validators.compose([Validators.required])],
        'celular1': [this.paciente.celular1, Validators.compose([Validators.required])],
        'celular2': [this.paciente.celular2],
        'telefone': [this.paciente.telefone],
        'responsaveis': [this.paciente.responsaveis],
        'cep': [this.paciente.cep, Validators.compose([Validators.required,Validators.minLength(8)])],
        'cidade': [this.paciente.cidade, Validators.compose([Validators.required])],
        'endereco': [this.paciente.endereco, Validators.compose([Validators.required])],
        'bairro': [this.paciente.bairro, Validators.compose([Validators.required])],
        'numero': [this.paciente.numero, Validators.compose([Validators.required])],
        'complemento': [this.paciente.complemento],
        'psicologo': [this.paciente.psicologo, Validators.compose([Validators.required])],
        'crp': [this.paciente.crp, Validators.compose([Validators.required])]
      });

      if(this.fGroup.value.atendimento == "Convênio"){
        this.fGroup.get("convenio").setValidators([Validators.compose([Validators.required])]);
      }else{
        this.fGroup.get("valor").setValidators([Validators.compose([Validators.required])]);
      }
    });
  }

  dataInicioMascara(event){

    // let digito = event.key;

    // if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
    //   return false;
    // }else{
    //   let data: string = (this.fGroup.value.dataInicio) ? this.fGroup.value.dataInicio : "";

    //   if(data.length == 1 || data.length == 4){
    //     data = data + digito + "/";
        
    //     this.fGroup.get('dataInicio').setValue(data);
    //     return false
    //   }
    // }
  }
  
  dataNascimentoMascara(event){
    // let digito = event.key;

    // if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
    //   return false;
    // }else{
    //   let data: string = (this.fGroup.value.dataNascimento) ? this.fGroup.value.dataNascimento : "";

    //   if(data.length == 1 || data.length == 4){
    //     data = data + digito + "/";
        
    //     this.fGroup.get('dataNascimento').setValue(data);
    //     return false
    //   }
    // }
    
  }  

  dataEncerrouMascara(event){
    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.dataEncerrou) ? this.fGroup.value.dataEncerrou : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.fGroup.get('dataEncerrou').setValue(data);
        return false
      }
    }
    
  }

  formatarValor(event) {

    let digito = event.key;
    let valor: string = this.fGroup.value.valor;

    if(digito == ","){
      
    }else if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "-"){
       return false;
    }else if(valor.trim().length > 7){
      return false;
    }

    this.fGroup.get('valor').setValue(valor);
  }  

  numeroCEP(){

    // if(this.fGroup.value.cep){
    //   let cep = this.fGroup.value.cep;

    //   if(cep.length > 8){
    //     cep = cep.slice(0,-1);
    //   }else if(isNaN(parseInt(cep.substr(-1))) || cep.substr(-1) == "." || cep.substr(-1) == " " || cep.substr(-1) == "-"){
    //     cep = cep.slice(0,-1);
    //   }

    //   this.fGroup.get('cep').setValue(cep);
    // }
  }
  
  getCEP() {

    let cep = this.fGroup.value.cep;

    if(cep.length == 8){	
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;
      //Valida o formato do CEP.
      if(validacep.test(cep)) {
        this.mostrarSpinner = true;

        this.http.get("https://viacep.com.br/ws/" + cep + "/json/")
          .toPromise()
          .then(async (res:any) => {
            this.fGroup.get('endereco').setValue(res.logradouro);
            this.fGroup.get('bairro').setValue(res.bairro);
            this.fGroup.get('cidade').setValue(res.localidade);
            this.mostrarSpinner = false;
          }).catch(erro => { 
            console.log("erro busca cep:",erro);
            this.mostrarSpinner = false;
          });
      } 
    }
  }
  
  celular1Numero(event){
    //return this.formatoTelefone(this.fGroup.value.celular1,"celular1",event);
  }

  celular2Numero(event){
    //return this.formatoTelefone(this.fGroup.value.celular2,"celular2",event);
  }  

  fixoNumero(event){
    //return this.formatoTelefone(this.fGroup.value.telefone,"telefone",event);
  }  

  formatoTelefone(numero: string, campo: string, event: any){

    numero = (numero) ? numero : "";
    let digito: string = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else if(numero.length == 0){
      numero = numero + "(" + digito;
      this.fGroup.get(campo).setValue(numero);
      return false;
    }else if(numero.length == 3){
      numero = numero + ") " + digito;
      this.fGroup.get(campo).setValue(numero);
      return false;
    }else if(numero.length == 10){
      numero = numero + "-" + digito;
      this.fGroup.get(campo).setValue(numero);
      return false;
    }
  }

  async salvarDados() {

    await this.servicos.presentLoading();
    this.paciente = this.fGroup.value;
    this.paciente.userId = "100";

    if(this.paciente.atendimento == "Convênio"){
      this.paciente.valor = this.convenios.find(c => c.convenio == this.paciente.convenio).valor;
    } 

    let dia = parseInt(this.paciente.dataInicio.substr(0,2)); // 12/12/2020
    let mes = parseInt(this.paciente.dataInicio.substr(3,2));
    let ano = parseInt(this.paciente.dataInicio.substr(6,4));
    this.paciente.dataInicioStamp = new Date(ano,mes - 1,dia,0,0,0).getTime();          

    if(this.pacienteId){
      try {
        await this.pacienteService.updatePaciente(this.pacienteId, this.paciente);
        await this.servicos.loading.dismiss();

        this.navCtrl.navigateBack('/tabs/tab2');
      } catch (error) {
        this.servicos.presentToast('Erro ao tentar salvar');
        this.servicos.loading.dismiss();
      }
    }else{
      try {

        let prontuario: Prontuario = {
          codigo: this.novoCodigo,
          demanda: "",
          encaminhamento: "",
          evolucao: "",
          objetivos: "",
          procedimentos: ""
        }

        this.paciente.prontuario = prontuario;

        this.paciente.valor

        console.log("this.paciente:",this.paciente);

        await this.pacienteService.addPaciente(this.paciente);
        await this.pacienteService.incrementaCodigo(this.codigoProntuarioId, { nome: "codigoProntuario", valor: this.novoCodigo } );
        await this.servicos.loading.dismiss();
        this.navCtrl.navigateBack('/tabs/tab2');

      } catch (error) {
        console.log("error:",error);
        this.servicos.presentToast('Erro ao tentar salvar');
        this.servicos.loading.dismiss();
      }
    }
  }

  setarCPR(selecionado){
    //console.log("mudou psicologo",selecionado);
    let nomes = this.psicologos;
      nomes.filter(c => {
      return c.nome == selecionado;
    }).map(c => {
      this.fGroup.get("crp").setValue(c.crp);
      //console.log("mudou psicologo",c.crp)
    });
  }

}