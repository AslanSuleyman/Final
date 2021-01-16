import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { Post } from '../models/post';
import { Sonuc } from '../models/test';
import { FbserviceService } from '../services/fbservice.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
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
  Posts = [];
  constructor(
    private storage:AngularFireStorage,
    private fbservice:FbserviceService,
    private toastController: ToastrService,
    private router:Router,
    ) { }

  ngOnInit(): void {
    var user = localStorage.getItem('user');
    if(user){
      this.userInf = JSON.parse(localStorage.getItem('user'));
    }
    this.PostListele();
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
      this.toastController.error('Lütfen bir başlık giriniz.','Hata')
      return
    }else if(!(this.Post.desc?.length >0)){
      this.toastController.error('Lütfen bir açıklama metni giriniz.','Hata')
      return
    }else if(!(this.Post.category?.length >0)){
      this.toastController.error('Lütfen bir kategori belirleyiniz.','Hata')
      return
    }else if(!(this.Post.imgUrl?.length >0)){
      this.toastController.error('Lütfen bir resim yükleyiniz.','Hata')
      return
    }

    var tarih = new Date();
    this.Post.createDate = tarih.getTime();
    this.Post.likeCount = 0;
    this.Post.creator = this.userInf.uid;
    this.fbservice.KayitEkle(this.Post).then(res=>{
    this.toastController.success('Postunuz başarılı bir şekilde paylaşıldı.','Başarılı')
    this.router.navigateByUrl('/home');
    },err=>{
      this.toastController.error('Bir hata ile karşılaşıldı lütfen daha sonra tekrar deneyiniz.','Hata')
      console.log(JSON.stringify(err));
    })
    console.log(this.Post);
  }

  PostListele() {
    this.fbservice.KayitListeleByUID(this.userInf.uid).snapshotChanges().subscribe(data => {
      this.Posts = [];
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.Posts.push(y as Post);
      });
    });
  }

  editPost(post) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        key: post.key
      }
    };
    this.router.navigate(['/edit-page'], navigationExtras);
  }
}
