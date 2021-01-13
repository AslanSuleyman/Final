import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import  {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard'
import { ProfileComponent } from './profile/profile.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { PostlarComponent } from './postlar/postlar.component';
import { HeaderComponent } from './header/header.component';

const redirectLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate :[AngularFireAuthGuard],
    data:{
      authGuardPipe:redirectLogin
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit-page', component: EditPageComponent },
  { path: 'postlar', component: PostlarComponent },
  { path: 'header', component: HeaderComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
