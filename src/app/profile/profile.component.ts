import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Kayit } from '../models/kayit';
import { FbserviceService } from '../services/fbservice.service';
import { map, finalize } from "rxjs/operators";
import { Post } from '../models/post';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  User: Kayit;
  userInf;
  Post :Post = new Post();
  Posts = [];
  downloadURL: Observable<string>;
  uploadProgress$: Observable<number>
  postCount = 0;
  constructor(
    private fbservice: FbserviceService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    var user = localStorage.getItem('user');
    if (user) {
      this.userInf = JSON.parse(localStorage.getItem('user'));
      this.getUser();
      this.getPostsCount()
    }


  }
  openFile(file) {
    file.click()

  }

  onFileChanged(event) {
    var n = Date.now();
    const file = event.target.files[0];

    const filePath = `UserPhotos/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`UserPhotos/${n}`, file);
    this.uploadProgress$ = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              console.log(url);
              console.log(this.User.username);
              const profile = {
                photoURL: url,
                displayName: this.User.username
              }
              this.fbservice.updateProfile(profile);
              this.userInf.photoURL = url;
              this.userInf.displayName = this.User.username;
              localStorage.setItem('user', JSON.stringify(this.userInf))
              this.User.photo = n.toString();
              this.fbservice.updateUser(this.User);
            }
            // this.Post.imgUrl = this.fb;

          });
        })
      )
      .subscribe(url => {
        if (url) {
        }
      });
  }
  getUser() {
    this.fbservice.UserListeleByUID(this.userInf.uid).snapshotChanges().subscribe(data => {
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.User = y as Kayit;
        console.log(this.User);
        this.getLikedPosts();
      });
    })
  }

  getLikedPosts(){
    this.fbservice.KayitListele().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      console.log(this.User.uid);
      console.log(data);
      data.forEach(element=>{
        if(element.likes){
          if(element.likes[this.User.uid]){
            this.Posts.push(element as Post);
          }
        }
        
      })
      
    })
  
  }

  getPostsCount(){
    this.fbservice.KayitListeleByUID(this.userInf.uid).snapshotChanges().subscribe(data => {
      
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.postCount++;
        
      });
    });
  }
}
