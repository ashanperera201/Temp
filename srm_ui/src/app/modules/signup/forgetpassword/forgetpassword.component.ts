import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivateViewModel } from 'app/main/Models/etendering/ViewModels/ActivateViewModel';
import { UserSignService } from 'app/shared/Services/etendering/usersign.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {
  forgetpasswordform: FormGroup;
  email: string;
  code: string;
  userId: string;
  isButtonEnable = false;
  constructor(private fb: FormBuilder,
    private userSignService: UserSignService,
    private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    const email = this.activatedRoute.snapshot.queryParamMap.get('email');
    const userId = this.activatedRoute.snapshot.queryParamMap.get('userId');
    this.email = JSON.parse(email);
    this.userId = JSON.parse(userId);
    this.forgetpasswordform = this.fb.group({
      password2:[null],
      password: [null],
      code: [null]
  });
  }
  forgetPasswordForm(){
    const activateModel = new ActivateViewModel();
      activateModel.password = this.forgetpasswordform.get('password').value;
      activateModel.code = this.code;
      activateModel.userIdentifier = this.userId;
      this.userSignService.resetPassword(activateModel).subscribe((data)=>{
         
      }, error =>{
         console.log(error);
      });
  }

  generateLink(){
    this.userSignService.generateCode(this.email).subscribe((code) => {
      this.code = code;
      if(this.code){
        this.isButtonEnable = true;
      } else{
        this.isButtonEnable = false;
      }
    }, error =>{
      console.log(error);
    })
  }
}
