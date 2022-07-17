import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Paciente } from '../interfaces/paciente';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacientesCollection: AngularFirestoreCollection<Paciente>;

  constructor(
    private afs: AngularFirestore, 
  ) {
    this.pacientesCollection = this.afs.collection<Paciente>('Pacientes');
  }

  getPacientes(crp:string){
    console.log("crp",crp);
    return this.afs.collection<Paciente>('Pacientes', ref => ref
    .where('crp','==',crp))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data };
        })
      })
    )
   }  

  getPaciente(id: string){
    return this.pacientesCollection.doc<Paciente>(id).valueChanges();
  }

  updatePaciente(id: string, paciente: Paciente){
    return this.pacientesCollection.doc<Paciente>(id).update(paciente);
  }

  addPaciente(paciente: Paciente){
    return this.pacientesCollection.add(paciente);
  }

  incrementaCodigo(id: string, codigo: any){
    return this.afs.collection<any>('numerosChaves').doc(id).update(codigo);
  }

  getCodigoProntuario(){
    return this.afs.collection<any>('numerosChaves', ref => ref
    .where('nome','==','codigoProntuario'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        })
      })
    )
   }  


}
