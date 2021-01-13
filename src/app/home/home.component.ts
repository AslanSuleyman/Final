import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post';
// import { map } from 'rxjs/operators';
import { FbserviceService } from '../services/fbservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  liked = false;
  accessToEditPost = false;
  Posts: Observable<Post>;
  selectedCard;
  userInf;
  specialUID;
  constructor(
    private router: Router,
    private fbservice: FbserviceService,
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
    if(this.Posts[i].creator == this.userInf.uid){
      this.accessToEditPost = true;
    }else{
      this.accessToEditPost = false;
    }
    
  }

  mouseLeaveCard() {
    this.selectedCard = -1;
  }

  goDetail() {
    console.log('caard detail');
  }

  getList() {
    this.fbservice.KayitListele().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.Posts = data;
      console.log(this.Posts);
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


}
