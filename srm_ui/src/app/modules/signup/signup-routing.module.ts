import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { LoginComponent } from './login/login.component';
import { SetupComponent } from './setup/setup.component';


const routes: Routes = [
   {
      path: 'user-activate',
      component: SetupComponent,
      
   },
   {
      path: 'login',
      component: LoginComponent,
      
   },
   {
      path: 'forgetpassword',
      component: ForgetpasswordComponent,
      
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class SignupRoutingModule {}
