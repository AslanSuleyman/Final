import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommentPost } from '../models/comment';
import { Post } from '../models/post';
// import { map } from 'rxjs/operators';
import { FbserviceService } from '../services/fbservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('commentInp') comment_input : HTMLInputElement;
  liked = false;
  accessToEditPost = false;
  Posts: Observable<Post>;
  comment: CommentPost = new CommentPost();
  Comments = [];
  selectedCard;
  userInf;
  specialUID;
  commentsec: string;
  constructor(
    private router: Router,
    private fbservice: FbserviceService,
    private toastController: ToastrService,
  ) {

  }

  ngOnInit() {
    this.getList();

    var user = localStorage.getItem('user');
    if (user) {
      this.userInf = JSON.parse(localStorage.getItem('user'));
      this.specialUID = this.userInf.uid;
    }



  }

  addLike(post) {
    // this.liked = !this.liked;
    if (post.likeCount && post.likes[this.userInf.uid]) {
      post.likeCount--;
      post.likes[this.userInf.uid] = null;
    } else {
      post.likeCount++;
      if (!post.likes) {
        post.likes = {};
      }
      post.likes[this.userInf.uid] = true;
    }
    this.fbservice.KayitDuzenle(post).then(res => {

    }, err => {
      console.log(JSON.stringify(err));
    })
  }

  getLikeStatus(post) {
    if (post.likes) {
      if (post.likes[this.specialUID])
        return true;
    } else {
      return false;
    }

  }
  mouseOnCard(i) {
    this.selectedCard = i;
    if (this.Posts[i].creator == this.userInf.uid) {
      this.accessToEditPost = true;
    } else {
      this.accessToEditPost = false;
    }

  }

  mouseLeaveCard() {
    this.selectedCard = -1;
  }

  goDetail() {
    console.log('caard detail');
  }

  getList() {//eğer uygulama ilk çalıştırıldığında cannot get hatası alıyorsanız bu fonksiyonun içini kapatıp çalıştırın uygulama webde açıldıktan sonra bu fonksiyonu açabilirsiniz.
    this.fbservice.KayitListele().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.Posts = data;

      this.Posts.forEach(element => {

        this.fbservice.UserListeleByUID(element.creator).snapshotChanges().subscribe(data => {
          data.forEach(satir => {
            const y = { ...satir.payload.toJSON() };
            if (y['city'])
              element.from = y['city'];

            element.creatorName = y['username'];
            this.fbservice.getPhotoByName(y['photo']).subscribe(url => {
              element.creatorPhoto = url;
            })
          });
        })
      })

    })
  }
  editPost(post) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        key: post.key
      }
    };
    this.router.navigate(['/edit-page'], navigationExtras);
  }
  editcommentmode = false;
  addComment(data, post) {
   
    console.log(data.value);
    if (data.value && this.userInf.uid) {
      if (this.comment.key) {
        this.comment.comment = data.value;
        console.log('yorum editle')
        this.fbservice.editComment(this.comment).then(res=>{
          this.toastController.success('Yorum düzenlendi.')
        },err=>{
          this.toastController.error('Bir hata oluştu daha sonra tekrar deneyiniz')
        })
        return;
      }
      console.log('Yorum paylaş')
      this.comment.comment = data.value;
      this.comment.postkey = post.key;
      this.comment.userPhoto = this.userInf.photoURL;
      this.comment.username = this.userInf.displayName;
      console.log(this.comment);
      this.fbservice.addComment(this.comment);
      if(post.commentCount){
        post.commentCount++;
      }else{
        post.commentCount = 1;
      }
      console.log(post);
      this.fbservice.KayitDuzenle(post).then(res => {
        data = '';
        this.toastController.success('Yorum paylaşıldı.')

      }, err => {
        this.toastController.error('Bir hata oluştu daha sonra tekrar deneyiniz')
        // console.log(JSON.stringify(err));
      })

    }

  }
  selectedComment = -1;
  showComments(post, i) {
    if (this.selectedComment == i) {
      this.selectedComment = -1;
    } else {
      this.selectedComment = i;
    }
    this.fbservice.getComments(post.key).snapshotChanges().subscribe(res => {
      this.Comments = [];
      res.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.Comments.push(y as CommentPost);
      });
    }
    )
  }

  editComment(comment: CommentPost,i) {
    this.editcommentmode = true;
    this.selectedComment = i
    Object.assign(this.comment,comment);
    this.comment_input['nativeElement'].value = this.comment.comment;
  }
  leaveEditMode(){
    this.editcommentmode = false;
    this.comment = new CommentPost();
    this.comment_input['nativeElement'].value = '';
  }
  deleteComment(comment,post){
   
    if(confirm("Yorumu silmek istediğinden emin misin?")){
      this.fbservice.deleteComment(comment.key).then(res=>{
        post.commentCount--;
        this.fbservice.KayitDuzenle(post);
        this.toastController.success('Yorumunuz silindi.');
      },err=>{
        this.toastController.error('Bir hata oluştu daha sonra tekrar deneyiniz')
      });
    }
    
  }
  categorizedBy(item) {
    // // console.log(item);
    // this.fbservice.KayitListeleByCategory(item).snapshotChanges().subscribe(data => {
    //   data.forEach(satir => {
    //     const y = { ...satir.payload.toJSON(), key: satir.key };
    //     console.log(y);
    //     this.Posts.push(y as Post);
    //   });
    // });

  }

}
