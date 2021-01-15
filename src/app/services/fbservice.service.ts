import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class FbserviceService {
  private dbKayit = '/Posts';
  private dbUsers = '/Kullanıcılar'
  kayitRef = null;
  kayitUsers;
  constructor(
    public db: AngularFireDatabase,
    public fireAuth: AngularFireAuth,
    public storage:AngularFireStorage
  ) {
    this.kayitRef = db.list(this.dbKayit);
    this.kayitUsers = db.list(this.dbUsers);
  }

  OturumAc(email, pass) {
    return this.fireAuth.signInWithEmailAndPassword(email, pass);
  }
  OturumKapat() {
    return this.fireAuth.signOut();
  }
  KayitListele() {
    return this.kayitRef;
  }
  PostListele() {

  }
  async updateProfile(profile) {

    return (await this.fireAuth.currentUser).updateProfile(profile)

  }
  getPhotoByName(n){
    const filePath = `UserPhotos/${n}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }
  updateUser(user) {
    return this.kayitUsers.update(user.key, user);
  }
  registerUser(user) {
    return this.fireAuth.createUserWithEmailAndPassword(user.mail, user.password);
  }
  createUser(user) {
    return this.kayitUsers.push(user);
  }
  KayitByKey(key) {
    return this.db.object("Posts/" + key)
  }
  KayitEkle(post: Post) {
    return this.kayitRef.push(post);
  }
  KayitListeleByUID(creator: string) {
    return this.db.list("/Posts", q => q.orderByChild("creator").equalTo(creator));
  }
  KayitListeleByCategory(category: string) {
    return this.db.list("/Posts", q => q.orderByChild("category").equalTo(category));
  }
  UserListeleByUID(uid) {
    return this.db.list("/Kullanıcılar", q => q.orderByChild("uid").equalTo(uid));
  }
  KayitDuzenle(kayit) {
    return this.kayitRef.update(kayit.key, kayit);
  }
  KayitSil(key: string) {
    return this.kayitRef.remove(key)
  }
  getLikedPosts(uid){
    return this.db.list("/Posts", q => q.orderByChild("likes").equalTo(uid));
  }
}
