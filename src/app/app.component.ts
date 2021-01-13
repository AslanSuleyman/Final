import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FbserviceService } from './services/fbservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Final';

  constructor(
    private fbservice:FbserviceService,
    private router:Router
  ){
    
  }
  ngOnInit(): void {

  }
  
  logout(){
    this.fbservice.OturumKapat().then(d=>{
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    })
  }
  onClick(){

  }
  toggleMenu(){
    $("#menu-toggle").on("click", function(e){
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    } )
  }
}
