import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FbserviceService } from '../services/fbservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private fbservice:FbserviceService,
    private router :Router
    ) { }

  ngOnInit(): void {
  }
  logout(){
    this.fbservice.OturumKapat().then(d=>{
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    })
  }
}
