import { Injectable } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private sessoesCollection: AngularFirestoreCollection<Sessao>;

  constructor(private afs: AngularFirestore) { 
    this.sessoesCollection = this.afs.collection<Sessao>('Sessoes');
  }

  getSessoes(crp){
    return this.sessoesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        }).filter(s => {
          return s.crp == crp;
        });
      })
    )
   } 

   getSessao(id: string){
    return this.sessoesCollection.doc<Sessao>(id).valueChanges();
  }

   updateSessao(id: string, sessao: Sessao){
    return this.sessoesCollection.doc<Sessao>(id).update(sessao);
  }   

}
