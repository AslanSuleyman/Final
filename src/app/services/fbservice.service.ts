import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Kayit } from '../models/kayit';

@Injectable({
  providedIn: 'root'
})
export class FbserviceService {
  private dbKayit = '/Kayitlar'
  kayitRef = null;
  constructor(
    public db: AngularFireDatabase,
    private fireAuth : AngularFireAuth,
  ) {
    this.kayitRef = db.list(this.dbKayit);
  }

  OturumAc(email,pass){
    return this.fireAuth.signInWithEmailAndPassword(email,pass);
  }
  OturumKapat(){
    return this.fireAuth.signOut();
  }
  KayitListele() {
    return this.kayitRef;
  }

  KayitEkle(kayit) {
    return this.kayitRef.push(kayit);
  }

  KayıtDuzenle(kayit) {
    return this.kayitRef.update(kayit.key, kayit);
  }
  KayitSil(key: string) {
    return this.kayitRef.remove(key)
  }

  registerUser(user): void{
    this.fireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }
}
