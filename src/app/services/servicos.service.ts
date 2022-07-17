import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  public loading: any;

  public cobranca: any;

  private cobrancaCollection: AngularFirestoreCollection<any>;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCrtl: ToastController,
    private afs: AngularFirestore
  ) {
    this.cobrancaCollection = this.afs.collection<any>('Fernando');
  }

  public async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
    return this.loading.present();
  }

  public async presentToast(message: string, duration = 2000){
    const toast = await this.toastCrtl.create({ message,  duration });
    toast.present();
  }  

  getCobranca(){
    return this.cobrancaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
  }  


  // public formatarValor(event, dados) {

  //   let digito = event.key;

  //   if(dados.length > 8){
  //     return false;
  //   }else if(digito == ","){
      
  //   }else if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
  //     return false;
  //   }

  //   return dados;
  // }  

  async presentLoading2Seconds() {
    const loading = await this.loadingCtrl.create({
      message: "Por favor, aguarde...",
      duration: 2000
    });
    await loading.present();
  }

}
