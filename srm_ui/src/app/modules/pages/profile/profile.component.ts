import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OverlayComponent } from '../../common/overlay/overlay.component';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileUploader } from 'ng2-file-upload';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '@auth0/auth0-angular';
import config from '../../../../auth_management_api_config.json';

import { environment } from 'environments/environment';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { RolesService } from '../../../shared/Services/roles.service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  panelOpenState = false;
  formFieldHelpers: string[] = [''];
  supplierDetailsSummary = new FormGroup({
    type: new FormControl('Admin'),
    email: new FormControl('admin@123.com'),
    id: new FormControl('12232*#&#^888'),
    role: new FormControl('Admin'),
  });
  createnew = new FormGroup({
    firstname: new FormControl('Adam'),
    lastname: new FormControl('Block'),
    email: new FormControl('Adam@abcd.com'),
    password: new FormControl('*****'),
    confirmpassword: new FormControl('*****'),
  });
  contactPerson = new FormGroup({
    title: new FormControl(1),
    firstname: new FormControl('Adam'),
    lastname: new FormControl('Block'),
    position: new FormControl('Manager'),
    email: new FormControl('Adam@abcd.com'),
    telephone: new FormControl('+1 719-570-5336'),
    telephone2: new FormControl('719-570-5336'),
    ext: new FormControl('0'),
    mobile: new FormControl('+1 719-570-5336'),
    mobile2: new FormControl('719-570-5336'),
    fax: new FormControl('+1 719-570-5336'),
    mobile3: new FormControl('719-570-5336'),
  });
  registrationDetails = new FormGroup({
    regnumber: new FormControl('32432423'),
    regfile: new FormControl('Design supplier 01-06_RegistrationCertificate.pdf'),
    expirationdate: new FormControl(new Date()),
    vatnumber: new FormControl('32432423'),
    vatfile: new FormControl('Design supplier 01-06_VatRegistration_166_v1.docx'),
    gosifile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
    gosiexpirationdate: new FormControl(new Date()),
    saudiexpirationdate: new FormControl(new Date()),
    saudifile: new FormControl('Design supplier 01-06_SaudizationCertificate.docx'),
    zakathexpirationdate: new FormControl(new Date()),
    zakathfile: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),

  });

  iserrorChangeRoleProfile: boolean = false;
  issuccessChangeRoleProfile: boolean = false;
  successmessageChangeRoleProfile = 'Successfully saved!';
  errormessageChangeRoleProfile = 'Something went wrong!';

  apiToken = localStorage.getItem("auth0token");
  apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');

  token: string;
  // apiToken:string;

  space = " ";

  selectedValue: string;
  selectedUser: string;

  selectedGetRoleUser: string;
  selectedUserAssignRole: string;
  selectedRole: string;
  selectedMyRole: string;
  selectedMyRoleId: string;
  selectedAssignMyRoleId: string;


  selectedPage: string;

  selectedUserDeleteRole: string;
  selectedUserSpecificRole: string;
  selectedAssignMyRole: string;

  selectedCar: string;



  message: string = null;
  responseJson: string;

  isAdmin: boolean;

  userId: string;
  fetchedUsers: any = [];
  fetchedUserRole: any = [];
  fetchedUserSpecificRoles: any = [];
  assignedUserRole: any = [];

  accessTokenDetail: any = [];


  fetchedMyRole: any = [];

  fetchedMyRoleN: any = [];


  fetchedMyRoleNew: string = null;
  fetchedMyRoleNewId: string = null;
  fetchedMyRoleNewDetail: string = null;

  fetchedUserRoles: any = [];
  fetchedUserRolesChange: any = [];

  firstnameFormControl = new FormControl('', [
    Validators.required
  ]);

  lastnameFormControl = new FormControl('', [
    Validators.required
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);


  userIdFormControl = new FormControl('', [
    Validators.required
  ]);


  userIdRoleFormControl = new FormControl('', [
    Validators.required
  ]);

  roleFormControl = new FormControl('', [
    Validators.required
  ]);

  newRoleFormControl = new FormControl('', [
    Validators.required
  ]);



  matcher = new MyErrorStateMatcher();
  profileJson: string = null;
  profileSet: any = [];
  workflowCurrentuser;
  /**
   * Constructor
   */
  constructor(
    public auth: AuthService,
    private http: HttpClient,
    public nav: NotificationsComponent,
    private roleService: RolesService) {
    this.auth.user$.subscribe(
      (profile) => (
        this.profileJson = JSON.stringify(profile, null, 2),
        this.profileSet = profile,
        this.isUserLoggedIn(),
        this.getMyUserRole(),
        this.callManagementAPI(),
        this.getAllUserRoles(),
        this.readUser()

      )
    );
  }

  ngOnInit() {
    this.auth.user$.subscribe(
      (profile) => (
        this.profileJson = JSON.stringify(profile, null, 2),
        this.profileSet = profile
      )
    );
  }

  //   openDialog() {
  //     const dialogRef = this.dialog.open(OverlayComponent);

  //     dialogRef.afterClosed().subscribe(result => {
  //         console.log(`Dialog result: ${result}`);
  //     });
  // }


  userAprove() {
    console.log(this.selectedUser);
    console.log(this.selectedPage);

  }

  fetchAccessToken() {
    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/oauth/token';


    const body = '{"client_id":"OgkcSQ7ZYMva3RqrD71tFItYzVp6hWOM","client_secret":"TLpXFHq0D7GG6KwIGrdO2VWU-HFTRDVrk-DZQDg0yx_Emx5Z1ZtxrJVrVWal3ksp","audience":"https://dev-ay82ezuy.us.auth0.com/api/v2/","grant_type":"client_credentials"}';


    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };

    this.http.post(url, body, options)
      .subscribe(data => {
        console.log('Here is the Auth0 token');
        console.log(data);
        // this.accessTokenDetail = data;

        // this.accessTokenDetail = [];
        for (let key in data) {
          this.accessTokenDetail.push(data[key]);
        }

        console.log(this.accessTokenDetail);
        // for (var product of this.accessTokenDetail) {
        console.log(this.accessTokenDetail[0]);
        this.token = this.accessTokenDetail[0];
        // }

        // this.apiToken = 'Bearer'+" "+'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllkOWxDNExmcUpwaTFobmx0WktkNiJ9.eyJpc3MiOiJodHRwczovL2Rldi1heTgyZXp1eS51cy5hdXRoMC5jb20vIiwic3ViIjoiT2drY1NRN1pZTXZhM1JxckQ3MXRGSXRZelZwNmhXT01AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWF5ODJlenV5LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjA3OTI2NTM2LCJleHAiOjE2MDgwMTI5MzYsImF6cCI6Ik9na2NTUTdaWU12YTNScXJENzF0Rkl0WXpWcDZoV09NIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.n_UPQjeyjKho_KMB4N-oZeZ8EpohLxAx7qZWpGTd0m8Oj6N5GhNa6KsleTO8pO_8ZZWnBFJrxygMZOV-H6jrY2ICsCvgMVVZ4M9HfYZIEglbtBkQQgNeF369_Ruu2IgXBbtzMy9_gFF0j-97tl8z8KpI7UCmvCvliYT0tuSZHepTGVMAZeOYzNq_a6B-XAtwnwK-D3yNyiNn5UoeQ30afLMvJTT5jVOosKFlrOUscoDP-ZmKKxWkvuGURyKzSsx1RLPY8rFg0npBxWyc-ZiJu_1XeDVVYt9_ooogTiSCPu_k-9a-DgwG6Yyc1eUpNt4WSL3_YFZKSEsToFoJx2Tmug';    
        // console.log(this.apiToken);

      });
  }

  callManagementAPI() {
    const body = '';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get('https://dev-ay82ezuy.us.auth0.com/api/v2/users', options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        this.fetchedUsers = data;



      });

  }

  callCreateAPI() {



    // var result           = '';
    // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var charactersLength = characters.length;
    // for ( var i = 0; i < length; i++ ) {
    //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
    // }

    this.userId = "IMI" + "-" + this.firstnameFormControl.value;

    console.log('Firstname Value : ' + this.firstnameFormControl.value);
    console.log('Lastname Value : ' + this.lastnameFormControl.value);
    console.log('Email Value : ' + this.emailFormControl.value);
    console.log('Password Value : ' + this.passwordFormControl.value);

    const body = '{"email":"' + this.emailFormControl.value + '","user_metadata":{},"email_verified":true,"app_metadata":{},"username":"' + this.firstnameFormControl.value + '","given_name":"' + this.firstnameFormControl.value + '","family_name":"' + this.lastnameFormControl.value + '","name":"' + this.firstnameFormControl.value + '","nickname":"' + this.firstnameFormControl.value + '","picture":"https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png","user_id":"' + this.userId + '","connection":"Username-Password-Authentication","password":"' + this.passwordFormControl.value + '","verify_email":false}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.post<any>('https://dev-ay82ezuy.us.auth0.com/api/v2/users', body, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        // this.issuccess= true;
        // this.successmessage = 'Auth0 user Created Successfully!';

        const documentbody =
        {
          "userName": this.emailFormControl.value,
          "name": this.firstnameFormControl.value,
          "surname": this.lastnameFormControl.value,
          "emailAddress": this.emailFormControl.value,
          "isActive": true,
          "roleNames": ["Admin"],
          "password": '123qwe'
        }

        this.createWorkflowUser(documentbody);
      });



    // curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllkOWxDNExmcUpwaTFobmx0WktkNiJ9.eyJpc3MiOiJodHRwczovL2Rldi1heTgyZXp1eS51cy5hdXRoMC5jb20vIiwic3ViIjoibmZSYkR1Wkd1OTR0MFpmUXVHTmRzV1lYNkZtbXh0c0FAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWF5ODJlenV5LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjA3NzE4Njk4LCJleHAiOjE2MDc4MDUwOTgsImF6cCI6Im5mUmJEdVpHdTk0dDBaZlF1R05kc1dZWDZGbW14dHNBIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.qBN3HPgbcNGuaSGis8R0pJhkiVDHFzFwYicV2qc99oloJ_M3jhbNvdGlfEQy3nZcCmGhPIyM8vZn8GKJ5xKCP-qWCGyZpn6FERJgxxL-DjAvoqZSl1C90xqb0BSqwEsc5tS-6gFbiRmFhNAhHTp2i9tNhUFDSX16JCgO8w4FMArg1YXvrOwzVfv-khn3O2n7lPraT-HpmP-PyyXK-N3vVMRKIQGQUxIC16z2uAfLnNw4jYJYMg5RGKKxiTOHBpPq80gW8-lnRua9rAfu7ks9crDVDN1foDtOs8-xKhbO_1wioS4CYe7LMNmTHnq4KTV73AXadlg8XC5MjSLHvfjlYQ" -X POST  -H "Content-Type: application/json" -d '{"email":"john.doe@gmail.com","user_metadata":{},"email_verified":true,"app_metadata":{},"given_name":"John","family_name":"Doe","name":"John Doe","nickname":"Johnny","picture":"https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png","user_id":"abc","connection":"Username-Password-Authentication","password":"Pass1234@","verify_email":false}' https://dev-ay82ezuy.us.auth0.com/api/v2/users

  }

  createWorkflowUser(documentbody) {
    //const roleId = 'Desktop Auditor';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };

    this.http.post(environment.workflowApiUrl + '/api/services/app/User/Create', documentbody, options)
      .subscribe(data => {
        var supplierIds = data["result"];
        // alert("workflowuser created");
        // Swal.fire('workflowuser created!', 'success');
        // this.issuccess= true;
        // this.successmessage = 'Workflowuser Created Successfully!';
      });
  }
  //   Host: dev-ay82ezuy.us.auth0.com
  // Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllkOWxDNExmcUpwaTFobmx0WktkNiJ9.eyJpc3MiOiJodHRwczovL2Rldi1heTgyZXp1eS51cy5hdXRoMC5jb20vIiwic3ViIjoibmZSYkR1Wkd1OTR0MFpmUXVHTmRzV1lYNkZtbXh0c0FAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWF5ODJlenV5LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjA3NzE4Njk4LCJleHAiOjE2MDc4MDUwOTgsImF6cCI6Im5mUmJEdVpHdTk0dDBaZlF1R05kc1dZWDZGbW14dHNBIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.qBN3HPgbcNGuaSGis8R0pJhkiVDHFzFwYicV2qc99oloJ_M3jhbNvdGlfEQy3nZcCmGhPIyM8vZn8GKJ5xKCP-qWCGyZpn6FERJgxxL-DjAvoqZSl1C90xqb0BSqwEsc5tS-6gFbiRmFhNAhHTp2i9tNhUFDSX16JCgO8w4FMArg1YXvrOwzVfv-khn3O2n7lPraT-HpmP-PyyXK-N3vVMRKIQGQUxIC16z2uAfLnNw4jYJYMg5RGKKxiTOHBpPq80gW8-lnRua9rAfu7ks9crDVDN1foDtOs8-xKhbO_1wioS4CYe7LMNmTHnq4KTV73AXadlg8XC5MjSLHvfjlYQ

  getMyUserRole() {

    console.log(this.profileSet);
    console.log(this.profileSet.sub);

    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub + '/roles';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is my role');
        console.log(data);
        this.fetchedMyRole = data;

        for (var product of this.fetchedMyRole) {
          console.log(product.name);

          if (product.name == 'Admin') {
            this.isAdmin = true;
            console.log(this.isAdmin);
            this.redirectNormalUser();

          } else {

            // this.isAdmin = false;
            console.log('is not admin');
            // this.redirectNormalUser();
          }
        }
      });
    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7C5f87fcc300dbe80076505906/roles
  }

  getUserRole() {
    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.selectedGetRoleUser + '/roles';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        this.fetchedUserRole = data;

        // if(){

        // } else {

        // }



      });
    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7C5f87fcc300dbe80076505906/roles
  }

  getAllUserRoles() {
    const userId = 'auth0|5f87fcc300dbe80076505906';
    // const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/roles';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub + '/roles';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        this.fetchedUserRoles = data;
        this.fetchedUserRolesChange = data;


        // if(){

        // } else {

        // }



      });
    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7C5f87fcc300dbe80076505906/roles
  }

  clickedRole(id) {
    this.issuccessChangeRoleProfile = false;

    console.log(id);
    this.selectedMyRoleId = id;
  }

  clickedAssignRole(id) {
    console.log(id);
    this.selectedAssignMyRoleId = id;
  }

  changeMyRole() {
    this.issuccessChangeRoleProfile = true;
    this.successmessageChangeRoleProfile = 'Successfully changed the Role!';
    console.log();
    // PATCH	/api/v2/users/{id}
    //{ "user_metadata": {} }
    // '{"user_metadata":{"userRole":"tester"}}'
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/

    const body = '{"user_metadata":{"userRole":"' + this.selectedMyRole + '","userRoleId":"' + this.selectedMyRoleId + '","userDetail":"Test"}}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.patch(url, body, options)
      .subscribe({
        next: (data: any) => {
          if (data) {
            localStorage.setItem("userrole", this.selectedMyRole);
            localStorage.setItem("useremail", this.profileSet.email);
            if (this.fetchedMyRoleN.given_name) {
              localStorage.setItem("userfullname", this.fetchedMyRoleN.given_name + ' ' + this.fetchedMyRoleN.family_name);    // set username
            } else {
              localStorage.setItem("userfullname", this.fetchedMyRoleN.nickname);    // set username
            }
            this.nav.updateRole();
            this.roleService.roleChangeSubject.next(this.selectedMyRole);
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      });

  }

  changeMyRoleToAdmin() {

    // PATCH	/api/v2/users/{id}
    //{ "user_metadata": {} }
    // '{"user_metadata":{"userRole":"tester"}}'
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/
    // const body = '{"user_metadata":{"userRole":"Admin"}}';
    const body = '{"user_metadata":{"userRole":"Admin","userRoleId":"Admin","userDetail":"Test"}}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.patch(url, body, options)
      .subscribe({
        next: (data: any) => {
          localStorage.setItem("userrole", this.selectedMyRole);
          localStorage.setItem("useremail", this.profileSet.email);
          if (this.fetchedMyRoleN.given_name) {
            localStorage.setItem("userfullname", this.fetchedMyRoleN.given_name + ' ' + this.fetchedMyRoleN.family_name);    // set username
          } else {
            localStorage.setItem("userfullname", this.fetchedMyRoleN.nickname);    // set username
          }
          this.roleService.roleChangeSubject.next(this.selectedMyRole);
        },
        error: (error: any) => {
          console.log(error);
        }
      })
  }

  readUser() {
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/
    // const body = '{"user_metadata":{"userRole":"'+this.selectedMyRole+'"}}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        // console.log(data.user_metadata.userRole);
        // this.profileJson = JSON.stringify(profile, null, 2),
        this.fetchedMyRoleN = data;
        this.fetchedMyRoleNew = this.fetchedMyRoleN.user_metadata.userRole;
        this.fetchedMyRoleNewId = this.fetchedMyRoleN.user_metadata.userRoleId;
        this.fetchedMyRoleNewDetail = this.fetchedMyRoleN.user_metadata.userDetail;
        console.log(this.fetchedMyRoleNew);
        console.log(this.fetchedMyRoleNewId);
        console.log(this.fetchedMyRoleNewDetail);
      });
  }

  createUserRole() {
    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/roles';


    const body = '{"name":"' + this.newRoleFormControl.value + '","description":"' + this.newRoleFormControl.value + '"}';


    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.post(url, body, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        this.createWorkflowRole(this.newRoleFormControl.value);

        // this.assignedUserRole = data;


        // 
        // if(){

        // } else {

        // }

        // '{"roles":["rol_mPYWc1NZHKi56yNe"]}'
        // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7Cabc123/roles

      });
  }

  createWorkflowRole(rolename) {
    //const roleId = 'Desktop Auditor';

    const documentbody =
    {
      "name": rolename,
      "displayName": rolename,
      "normalizedName": rolename,
      "description": "",
      "isStatic": true,
      "permissions": [
        "Pages.Roles",
        "Pages.Users",
        "Pages.Tenants"
      ]
    }

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };

    this.http.post(environment.workflowApiUrl + '/api/services/app/Role/Create', documentbody, options)
      .subscribe(data => {
        var supplierIds = data["result"];
        // alert("workflowrole created");
        //   Swal.fire('Workflow role created!', 'success');

      });
  }

  getUserSpecificRoles() {
    console.log("Triggered getUserSpecificRoles");

    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.selectedUserDeleteRole + '/roles';


    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        this.fetchedUserSpecificRoles = data;

        // if(){

        // } else {

        // }



      });
  }

  deleteUserRole() {
    // this.getUserSpecificRoles(this.selectedUserDeleteRole);

    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.selectedUserDeleteRole + '/roles';

    const body = '{"roles":["' + this.selectedUserSpecificRole + '"]}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    // this.http.delete(url,options,body)
    //   .subscribe(data => {
    //       console.log('Here is the Auth0 data');
    //       console.log(data);


    // });
  }

  assignUserRole() {
    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.selectedUserAssignRole + '/roles';
    // console.log(this.selectedAssignMyRole);
    const body = '{"roles":["' + this.selectedAssignMyRoleId + '"]}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.post(url, body, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        this.assignedUserRole = data;

        // if(){

        // } else {

        // }

        // '{"roles":["rol_mPYWc1NZHKi56yNe"]}'
        // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7Cabc123/roles

      });


    const url2 = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.selectedUserAssignRole;

    //  if (this.selectedAssignMyRole == ) {

    //  }
    // selectedAssignMyRoleId
    // // https://dev-ay82ezuy.us.auth0.com/api/v2/users/
    const body2 = '{"user_metadata":{"userRole":"' + this.selectedAssignMyRole + '","userRoleId":"' + this.selectedAssignMyRoleId + '","userDetail":"Test"}}';
    // '{"user_metadata":{"userRole":"'+this.selectedMyRole+'","userRoleId":"'+this.selectedMyRoleId+'","userDetail":"Test"}}';


    this.http.patch(url2, body2, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);

        if (!this.fetchedUsers) {
          this.callManagementAPI();
        }

        let currentuser = this.fetchedUsers.filter(d => d.user_id == this.selectedUserAssignRole);
        // alert('Successfully Changed the Role!');

        this.getWorkflowUsers(currentuser[0].email);
        // alert('Successfully Changed the Role!');

      });
  }

  getWorkflowUsers(email) {
    //const roleId = 'Desktop Auditor';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };

    this.http.get(environment.workflowApiUrl + '/api/services/app/User/GetAll', options)
      .subscribe(data => {
        this.workflowCurrentuser = data["result"].items.filter(a => a.emailAddress == email);

        if (this.workflowCurrentuser) {
          let currentrolelist: string[] = this.workflowCurrentuser[0].roleNames;
          currentrolelist.push(this.selectedAssignMyRole);

          const documentbody =
          {
            "userName": this.workflowCurrentuser[0].userName,
            "name": this.workflowCurrentuser[0].name,
            "surname": this.workflowCurrentuser[0].surname,
            "emailAddress": this.workflowCurrentuser[0].emailAddress,
            "isActive": this.workflowCurrentuser[0].isActive,
            "fullName": this.workflowCurrentuser[0].fullName,
            "lastLoginTime": "2020-12-28 10:36:26.0095579",
            "creationTime": "2020-12-28 10:36:26.0095579",
            "roleNames": currentrolelist,
            "id": this.workflowCurrentuser[0].id
          }

          this.http.put(environment.workflowApiUrl + '/api/services/app/User/Update', documentbody, options)
            .subscribe(data => {
              var supplierIds = data["result"];
              // alert("workflowuser created");
              //   Swal.fire('Workflow user created!', 'success');

            });
        }
      });
  }

  createUser() {

    // this.http
    // .get(`https://dev-ay82ezuy.us.auth0.com/dbconnections/signup`)
    // .subscribe((result: Message) => {
    //   this.message = result.message;
    // });

    const body = {
      "email": "bilal.rifas@gmail.com",
      "phone_number": "+199999999999999",
      "user_metadata": {},
      "blocked": false,
      "email_verified": false,
      "phone_verified": false,
      "app_metadata": {},
      "given_name": "Supplier",
      "family_name": "Reviewer",
      "name": "Supplier Reviewer",
      "nickname": "Supplier",
      "picture": "https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png",
      "user_id": "Supplier",
      "connection": "CONNECTION",
      "password": "Pass1234@",
      "verify_email": false,
      "username": "Supplier"
    }

    // {
    //   "email": "bilal.rifas@gmail.com",
    //   "phone_number": "+199999999999999",
    //   "user_metadata": {},
    //   "blocked": false,
    //   "email_verified": false,
    //   "phone_verified": false,
    //   "app_metadata": {},
    //   "given_name": "Supplier",
    //   "family_name": "Reviewer",
    //   "name": "Supplier Reviewer",
    //   "nickname": "Supplier",
    //   "picture": "https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png",
    //   "user_id": "Supplier",
    //   "connection": "CONNECTION",
    //   "password": "Pass1234@",
    //   "verify_email": false,
    //   "username": "Supplier"
    // }

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };

    this.http.post<any>('https://dev-ay82ezuy.us.auth0.com/api/v2/users', body, options).subscribe(data => {
      console.log("Successfully Added new user!");

    })



    //   POST https://dev-ay82ezuy.us.auth0.com/dbconnections/signup
    // Content-Type: application/json
    // {
    //   "client_id": "79aK5td2AnJIMAbxTtUHdNUz7aTHGUAz",
    //   "email": "bilal.rifas@gmail.com",
    //   "password": "Pass1234@",
    //   "connection": "CONNECTION",
    //   "username": "Supplier",
    //   "given_name": "Supplier",
    //   "family_name": "Reviewer",
    //   "name": "Supplier Reviewer",
    //   "nickname": "Supplier",
    //   "picture": "http://example.org/jdoe.png"
    //   "user_metadata": { plan: 'silver', team_id: 'a111' }
    // }

  }



  loginWithRedirect(): void {
    this.auth.loginWithRedirect({ screen_hint: 'signup' });
  }

  isUserLoggedIn() {
    if (this.profileSet == null) {
      console.log('not authenticated');
      location.replace("/");


    } else {
      console.log('authenticated');
      // location.replace("/supplier/dashboard");

    }
  }

  redirectNormalUser() {
    console.log(this.isAdmin);
    if (this.isAdmin) {
      console.log('This is admin');
    } else {
      location.replace("/supplier/profile");

    }
  }

  createDocument() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };
    this.http.get(environment.workflowApiUrl + '/api/services/app/Document/GetPendingDocumentAsync', options).subscribe(data => {
      // Swal.fire('Successfully Migrated the old suppliers!', 'success');
    })
  }

  updateStatus() {
    const body = {};
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };

    this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetPendingStateAsync', options).subscribe(data => {
      // Swal.fire('Successfully Migrated the Status of the pending suppliers!', 'success');
    })
  }

}
