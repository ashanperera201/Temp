import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from 'app/main/Models/etendering/userprofile';
import { ActivateViewModel } from 'app/main/Models/etendering/ViewModels/ActivateViewModel';
import { UserSignService } from 'app/shared/Services/etendering/usersign.service';
import { parseString } from 'rrule/dist/esm/src/parsestring';
export class MyErrorStateMatcher implements ErrorStateMatcher {
   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
     const isSubmitted = form && form.submitted;
     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
   }
 }
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  userId: any;
  userCode: any;
  setupForm: FormGroup;
  emailFormControl: FormControl;
  passwordFormControl: FormControl;
  userProfile: UserProfile;
  matcher = new MyErrorStateMatcher();
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserSignService) { }

  ngOnInit(): void {
   this.emailFormControl = new FormControl('', [this.passwordValidator]);
   this.passwordFormControl = new FormControl('', [this.confirmPasswordValidator]);

    this.setupForm = this.fb.group({
      name:[null],
      password: [null, [this.passwordValidator]],
      confirmpassword: [null, [this.confirmPasswordValidator]]
  });
  const id = this.activatedRoute.snapshot.queryParamMap.get('userId');
  const code = this.activatedRoute.snapshot.queryParamMap.get('code');

  if (id) {
    this.userId = id;
    this.userCode = code;
  }
  this.userService.getUserToActivate(id).subscribe(
   (user) => {
      this.userProfile = user;
      this.setupForm.get('name').setValue(user.email);
   },
   (err) => {
      console.error(err);
   }
);
  }

  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
       return { error: true, required: true };
    }
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!regularExpression.test(control.value)) {
       return { error: true, special: true };
    }

    if (this.setupForm.controls.password.value.length < 8 || this.setupForm.controls.password.value.length > 8) {
       return { error: true, length: true };
    }

    if (this.setupForm.controls.confirmpassword.value && this.setupForm.controls.password.value !== this.setupForm.controls.confirmpassword.value) {
       return { error: true, mismatch: true };
    }

    return {};
 };

 confirmPasswordValidator = (control: FormControl): { [s: string]: boolean } => {
  if (!control.value) {
     return { error: true, required: true };
  }
  const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!regularExpression.test(control.value)) {
     return { error: true, special: true };
  }

  if (this.setupForm.controls.confirmpassword.value < 8 || this.setupForm.controls.confirmpassword.value.length > 8) {
     return { error: true, length: true };
  }
  if (this.setupForm.controls.confirmpassword.value !== this.setupForm.controls.confirmpassword.value) {
     return { mismatch: true, error: true };
  }

  return {};
};

   saveTemplate(){
      const activateModel = new ActivateViewModel();
      activateModel.password = this.setupForm.get('password').value;
      activateModel.code = this.userCode;
      activateModel.userIdentifier = this.userId;
      this.userService.activateUser(activateModel).subscribe((data)=>{
         
      }, error =>{
         console.log(error);
      });
   }
}
