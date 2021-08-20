import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paciente } from 'src/app/interfaces/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public pacientes = new Array<Paciente>();
  public todosPacientes = new Array<Paciente>();
  private pacientesSubscription: Subscription;
  public crp = "";
  public totalPacientes = 0;
  public buscaLetra = "";

  constructor(
    private pacienteService: PacienteService,
    private navCtrl: NavController,
    private router: Router,
  ) {

    this.crp = localStorage.getItem("crp");

    this.pacientesSubscription = this.pacienteService.getPacientes(this.crp).subscribe((data:Array<Paciente>) => {
      this.todosPacientes = data;

      this.todosPacientes.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });

      this.pacientes = this.todosPacientes;
      console.log("this.pacientes",this.pacientes);
      this.totalPacientes = this.pacientes.length;
    });

  }

  // async setaCodigo(data:Array<Paciente>){
  //   console.log("data",data);

  //   let contador = 100;

  //   for (const e of data) {
  //     contador++;
  //     e.prontuario.codigo = contador;
  //     await this.pacienteService.updatePaciente(e.id, e);
  //   }

  //   console.log("contador",contador);
  // }

  ngOndestroy(){
    this.pacientesSubscription.unsubscribe();
  }

  filtrarPorLetra(ev: any){
    const val = ev.target.value;
    this.pacientes = this.todosPacientes.filter((p:Paciente) => {
      return p.nome.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });

    this.totalPacientes = this.pacientes.length;
  }

  abrirHistorico(p:any){
    const navigationExtras: NavigationExtras = {
      state: {
          id: p.id,
          convenio: p.convenio,
          nome: p.nome
      }
    }
    //this.navCtrl.navigateRoot([`/tabs/sessoes-passada`], navigationExtras);
    this.router.navigateByUrl('tabs/sessoes-passada', navigationExtras);
  }

}
