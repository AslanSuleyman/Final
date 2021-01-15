import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Kayit } from '../models/kayit';
import { Sonuc } from '../models/test';
import { FbserviceService } from '../services/fbservice.service';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginsuccess: boolean = false;
  loginfailed: boolean = false;

  User: Kayit = new Kayit();
  sonuc: Sonuc = new Sonuc();
  constructor(
    private router: Router,
    private fbservice: FbserviceService,
    private toastController: ToastrService,
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
    this.fbservice.OturumAc(this.User.mail, this.User.password).then(res => {
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigateByUrl("/home");
        this.toastController.success('Giriş başarılı')
      }

    }, err => {
      this.toastController.error('Bilgileriniz eksik veya hatalı, lütfen doğru kullanıcı ile giriş yaptığınızdan emin olun.', 'Giriş Yapılamadı.')
      console.log(JSON.stringify(err));
    })
  }
  logout() {
    this.fbservice.OturumKapat();
  }

  register() {

    this.fbservice.registerUser(this.User).then(res => {
      console.log(res);
      if (res.user) {
        res.user.updateProfile({
          displayName: this.User.username
        })
        localStorage.setItem('user', JSON.stringify(res.user));
        this.User.uid = res.user.uid;
        this.fbservice.createUser(this.User);
        $('#KayitModal').modal('hide');
        this.toastController.success('Lütfen giriş yapınız', 'Kayıt Başarılı')
      }
    }, err => {
      this.toastController.error('Kayıt olma işleminiz başarısız sonuçlanmıştır.', 'Bir Hata Oluştu')
      $('#KayitModal').modal('hide');
      console.log(JSON.stringify(err));
    })
  }

  sonucClear() {
    this.sonuc.mesaj = '';
  }
}
