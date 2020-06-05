import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Psicologo } from '../interfaces/psicologo';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {

  private psicologosCollection: AngularFirestoreCollection<Psicologo>;

  constructor(private afs: AngularFirestore) { 
    this.psicologosCollection = this.afs.collection<Psicologo>('Psicologos');
  }

  getPsicologos(){
    return this.psicologosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
   } 

  getPsicologo(email: string){
    return this.psicologosCollection.doc<Psicologo>(email).valueChanges();
  }
}
