import { Injectable } from '@angular/core';
import { Convenio } from '../interfaces/convenio';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  private conveniosCollection: AngularFirestoreCollection<Convenio>;

  constructor(private afs: AngularFirestore) { 
    this.conveniosCollection = this.afs.collection<Convenio>('Convenios');
  }

  getConvenios(){
    return this.conveniosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
  }  

  addConvenio(convenio: Convenio){
    return this.conveniosCollection.add(convenio);
  }

   getConvenio(id: string){
    return this.conveniosCollection.doc<Convenio>(id).valueChanges();
  }

   updateConvenio(id: string, convenio: Convenio){
    return this.conveniosCollection.doc<Convenio>(id).update(convenio);
  }

   deleteConvenio(id: string){
    return this.conveniosCollection.doc(id).delete();
  }

  
}
