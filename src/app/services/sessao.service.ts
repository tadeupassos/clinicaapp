import { Injectable } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private sessoesCollection: AngularFirestoreCollection<Sessao>;

  constructor(private afs: AngularFirestore) {
    this.sessoesCollection = this.afs.collection<Sessao>('Sessoes');
  }

  getSessoes(crp) {
    return this.sessoesCollection.snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log("");
          return { id, ...data };
        })
          .filter(s => {
            return s.crp == crp;
          });
      })
    )
  }

  getSessoesTodos() {
    return this.afs.collection<Sessao>('Sessoes').snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log("");
          return { id, ...data };
        })
      })
    )
  }

  getSessoesPorData(crp: string, inicio: any, fim: any) {

    console.log("inicio",inicio);
    console.log("fim",fim);

    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('frequencia', '==', 'Presença')
      .where('dataSessaoStamp', '>=', inicio)
      .where('dataSessaoStamp', '<=', fim))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        })
      )
  }

  getSessoesPorMes(crp: string, mes: string, ano: string) {

    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('mes', '==', mes)
      .where('ano', '==', ano))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        })
      )
  }

  getSessoesPaciente(pacienteId: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
    .where('pacienteId', '==', pacienteId)
    .where('frequencia', 'in', ['Presença','Falta','Falta Justificada','Falta do Terapeuta','Feriado']))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesAgendadas(crp: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('frequencia', '==', '')
    ).snapshotChanges().pipe(
      //take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessao(id: string) {
    return this.sessoesCollection.doc<Sessao>(id).valueChanges();
  }

  updateSessao(id: string, sessao: Sessao) {
    return this.sessoesCollection.doc<Sessao>(id).update(sessao);
  }

  addSessao(sessao: Sessao) {
    return this.sessoesCollection.add(sessao);
  }

  deleteSessao(id: string) {
    return this.sessoesCollection.doc(id).delete();
  }

}
