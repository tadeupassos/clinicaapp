import { Component, OnInit } from '@angular/core';
import { PsicologoService } from '../services/psicologo.service';
import { Subscription } from 'rxjs';
import { Psicologo } from '../interfaces/psicologo';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = "";
  senha = "";
  emailVazio = false;
  senhaVazia = false;

  naoEncontrado = false;

  psicologo = [];

  private psicologoSubscription: Subscription;  

  constructor(
    private navCtrl: NavController,
    private psicologoService: PsicologoService
  ) { }

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.psicologoSubscription) this.psicologoSubscription.unsubscribe();
  }
  
  entrar(){

    if(this.email.trim().length <= 0){
      this.emailVazio = true;
    }else if(this.senha.trim().length <= 0){
      this.senhaVazia = true;
    }else{
      this.psicologoService.getPsicologos().subscribe(data => {
        this.psicologo = data.filter((p:Psicologo) => { 
          return this.email == p.email && this.senha == p.senha
        });

        if(this.psicologo.length > 0){
          localStorage.setItem("logado",this.email);
          localStorage.setItem("nomePsicologo",this.psicologo[0].nome);
          localStorage.setItem("crp",this.psicologo[0].crp);
          this.navCtrl.navigateForward('/tabs');
        }else{
          this.naoEncontrado = true;
        }
      });
    }

  }

  digitouEmail(){
    this.emailVazio = (this.email.trim().length <= 0);
    this.naoEncontrado = false;
  }

  digitouSenha(){
    this.senhaVazia = (this.senha.trim().length <= 0);
    this.naoEncontrado = false;
  }

}
