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

  getSessoesPorCrp(crp) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp))
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

  getSessoesTodos() {
    return this.afs.collection<Sessao>('Sessoes').snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesPorData(crp: string, inicioParam: any, fimParam: any, tipo: string, old = false) {

    let [ano, mes, dia] = inicioParam.split("-");
    let inicio = new Date(Number(ano), Number(mes) - 1, Number(dia), 0, 0, 0).getTime();

    [ano, mes, dia] = fimParam.split("-");
    let fim = new Date(Number(ano), Number(mes) - 1, Number(dia), 0, 0, 0).getTime();

    let freqNew = ['Presença', 'Falta Paciente', 'Falta Justificada Paciente', 'Falta Terapeuta', 'Falta Justificada Terapeuta', 'Recessos e Feriados', 'Manutenção Predial', 'Reposição'];

    let freqOld = ['Falta', 'Falta Justificada', 'Falta do Terapeuta', 'Feriados'];

    console.log("getSessoesPorData", "crp: " + crp + ", inicio: " + inicio + ", fim: " + fim + ", tipo: " + tipo);
    let query = this.afs.collection<Sessao>('Sessoes').ref
      .where('crp', '==', crp)
      .where('frequencia', 'in', old ? freqOld : freqNew)
      .where('dataSessaoStamp', '>=', inicio)
      .where('dataSessaoStamp', '<=', fim);

    if (tipo != "Todos") {
      query = query.where('nomeConvenio', '==', tipo);
    }

    return this.afs.collection<Sessao>('Sessoes', ref => query)
      .snapshotChanges()
      .pipe(
        take(1),
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

  // Esses antigos ficaram de fora 'Falta do Terapeuta', 'Feriado'

  getSessoesPaciente(pacienteId: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('pacienteId', '==', pacienteId)
      .where('frequencia', 'in', ['Presença', 'Falta Paciente', 'Falta Justificada Paciente', 'Falta Terapeuta', 'Falta Justificada Terapeuta', 'Recessos e Feriados', 'Manutenção Predial', 'Reposição', 'Falta', 'Falta Justificada']))
      .snapshotChanges().pipe(take(1),
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

  getSessoesSemProntuario(crp: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('frequencia', '==', 'Presença')
      .where('evolucao', '==', '')
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
