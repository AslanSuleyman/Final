import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, } from '@angular/fire/database';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class FbserviceService {
  private dbKayit ='/Posts';
  private dbUsers = '/Kullanıcılar'
  kayitRef = null;
  kayitUsers;
  constructor(
    public db: AngularFireDatabase,
    private fireAuth : AngularFireAuth,
  ) {
    this.kayitRef = db.list(this.dbKayit);
    this.kayitUsers = db.list(this.dbUsers);
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
  PostListele(){
    
  }
  registerUser(user){
    return this.fireAuth.createUserWithEmailAndPassword(user.mail, user.password);
   }
  createUser(user){
    return this.kayitUsers.push(user);
  }
  KayitByKey(key){
    return this.db.object("Posts/"+key)
  }
  KayitEkle(post : Post) {
    return this.kayitRef.push(post);
  }
  KayitListeleByUID(creator: string) {
    return this.db.list("/Posts", q => q.orderByChild("creator").equalTo(creator));
  }
  KayitDuzenle(kayit) {
    return this.kayitRef.update(kayit.key, kayit);
  }
  KayitSil(key: string) {
    return this.kayitRef.remove(key)
  }

}
