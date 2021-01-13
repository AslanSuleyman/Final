import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post';
import { FbserviceService } from '../services/fbservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  selectedFile: File = null;
  fb;
  key: string;
  downloadURL: Observable<string>;
  post: Post = new Post();
  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private fbservice: FbserviceService,
    private router: Router,
    private toastController: ToastrService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.key = params.key;
        this.getPost();
      }
    });
  }

  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `PostImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`PostImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  getPost() {
    this.fbservice.KayitByKey(this.key).snapshotChanges().subscribe(res => {
      var k = { ...(res.payload.toJSON() as Post), key: this.key };
      this.post = k;
    })
  }

  removePost(){
    
    if(confirm("Postu silmek istediğinden emin misin?")){
      this.fbservice.KayitSil(this.key);
      this.toastController.success('Post Kaldırıldı.')
      this.router.navigateByUrl('/postlar');
    }
  }

  editPost(){
    this.fbservice.KayitDuzenle(this.post).then(res => {
      this.toastController.success('Post Güncellendi.')
      this.router.navigateByUrl('/home');
    }, err => {
      console.log(JSON.stringify(err));
    })
  }
}
