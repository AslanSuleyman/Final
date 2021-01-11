import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FbserviceService } from '../services/fbservice.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginsuccess: boolean = false;
  loginfailed :boolean = false;
  User = {
    email: '',
    password: '',
    rememberme: false,
  }

  constructor(
    private router: Router,
    private fbservice: FbserviceService,
  ) { }

  ngOnInit(): void {


    if (localStorage.getItem('remember')) {
      var remember = localStorage.getItem('remember');
      if (remember) {
        this.router.navigateByUrl('/home');
      }
    }
  }
  login() {
   this.fbservice.OturumAc(this.User.email,this.User.password).then(res=>{
     console.log(res);
     if(res.user){
       localStorage.setItem('user',JSON.stringify(res.user));
       this.loginsuccess = true;
      this.router.navigateByUrl("/home");
     }
     
   },err=>{
    this.loginfailed = true;
     console.log(JSON.stringify(err));
   })
  }
  logout(){
    this.fbservice.OturumKapat();
  }


}
