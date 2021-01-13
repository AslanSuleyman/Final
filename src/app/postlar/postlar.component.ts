import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { Post } from '../models/post';
import { Sonuc } from '../models/test';
import { FbserviceService } from '../services/fbservice.service';
@Component({
  selector: 'app-postlar',
  templateUrl: './postlar.component.html',
  styleUrls: ['./postlar.component.scss']
})
export class PostlarComponent implements OnInit {
  fb;
  downloadURL: Observable<string>;
  Post: Post = new Post();
  sonuc: Sonuc = new Sonuc();
  userInf;
  uploadProgress$: Observable<number>

  constructor(
    private storage:AngularFireStorage,
    private fbservice:FbserviceService,
    ) { }

  ngOnInit(): void {
    var user = localStorage.getItem('user');
    if(user){
      this.userInf = JSON.parse(localStorage.getItem('user'));
    }
  }
  onFileSelected(event){
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `PostImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`PostImages/${n}`, file);
    this.uploadProgress$ = task.percentageChanges();
    task
      
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            this.Post.imgUrl = this.fb;
          });
        })
      )
      .subscribe(url => {
        if (url) {
        }
      });
  }
  sonucClear(){
    this.sonuc.mesaj = '';
  }
  createPost(){
    if(!(this.Post.header?.length >1)){
      this.sonuc.islem = false;
      this.sonuc.mesaj = 'Lütfen bir başlık giriniz.'
      return
    }else if(!(this.Post.desc?.length >0)){
      this.sonuc.islem = false;
      this.sonuc.mesaj = 'Lütfen bir açıklama metni giriniz.'
      return
    }else if(!(this.Post.category?.length >0)){
      this.sonuc.islem = false;
      this.sonuc.mesaj = 'Lütfen bir kategori belirleyiniz.'
      return
    }else if(!(this.Post.imgUrl?.length >0)){
      this.sonuc.islem = false;
      this.sonuc.mesaj = 'Lütfen bir resim yükleyiniz.'
      return
    }else{
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Postunuz başarılı bir şekilde paylaşıldı.'
    }
    var tarih = new Date();
    this.Post.createDate = tarih.getTime().toString();
    this.Post.likeCount = 0;
    // this.Post.likes ={}
    this.Post.creator = this.userInf.uid;
    this.fbservice.KayitEkle(this.Post).then(res=>{
      console.log(res);
    },err=>{
      console.log(JSON.stringify(err));
    })
    console.log(this.Post);
  }
}
