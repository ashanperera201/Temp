import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoginModel } from 'app/main/Models/etendering/InputModel';
import { UserLoginService } from 'app/shared/Services/etendering/userlogin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  email: string;
  userId:string;
  constructor(private fb: FormBuilder,
              private userLoginService: UserLoginService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.email = this.activatedRoute.snapshot.queryParamMap.get('email');
    this.userId = this.activatedRoute.snapshot.queryParamMap.get('userId');

    this.loginform = this.fb.group({
      name:[null],
      password: [null, [this.passwordValidator]],
      rememberme: [false]
  });
  if(this.email){
    this.loginform.get('name').setValue(this.email);
  }
  }

  loginForm(){
    const inputModel = new LoginModel();
    inputModel.password = this.loginform.get('password').value;
    inputModel.email = this.loginform.get('name').value;
    inputModel.rememberMe = this.loginform.get('rememberme').value;
    this.userLoginService.loginUser(inputModel,this.userId).subscribe((data) =>{
    }, error =>{
      console.log(error);
    });

  }

  clickForgetPassword(){
    const queryParams: any = {};
    queryParams.email = JSON.stringify(this.email);
    const userId = this.userId;
    queryParams.userId = JSON.stringify(userId);
         const navigationExtras: NavigationExtras = {
            queryParams,
         };
      this.router.navigate(['rfq/forgetpassword'],navigationExtras);
  }
  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
       return { error: true, required: true };
    }
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!regularExpression.test(control.value)) {
       return { error: true, special: true };
    }

    if (this.loginform.controls.password.value.length < 8 || this.loginform.controls.password.value.length > 8) {
       return { error: true, length: true };
    }

    return {};
 };
}
