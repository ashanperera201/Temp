import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, User } from '@auth0/auth0-angular';

import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { ToastService } from '../../../../../../shared/Services/toast.service';
import { SrmUserService } from '../../../../../../shared/Services/srm-user.service';
import { TYPE } from '../../../../../../shared/enums/toast.enum';
import { UserService } from '../../../../../../shared/Services/user.service';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss']
})
export class UserTabComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userList$: any[] = [];
  userForm: FormGroup;
  userRef: any;
  userProfileInformation: User;
  selectedUserGroups: any = [];
  uploader: FileUploader;
  userLogs: MatTableDataSource<any>;
  userLogRef: any[] = [];
  hasBaseDropZoneOver: boolean;
  userGroupNames: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  options: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  inputType: string = 'password';
  languages: any[] = [
    { viewValue: 'English', value: 'En ' },
    { viewValue: 'Spanish', value: 'Sp ' },
    { viewValue: 'French', value: 'Fr ' },
  ];

  currencies: any[] = [
    { viewValue: 'LKR', value: 'LKR ' },
    { viewValue: 'Dollar', value: 'Dollar ' },
  ];

  loginMethods: any[] = [
    { viewValue: 'Single Sign On', value: 'SSO' },
    { viewValue: 'Internal Login', value: 'IL' },
  ];

  filteredOptions: Observable<string[]>;
  groupNameSearch = new FormControl();

  // GRID COLUMNS
  displayedDashboardColumns: string[] = ['createdOn', 'comment', 'createdBy'];
  userId: string;
  imageUrl: any = 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg';

  constructor(
    // public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    private authService: AuthService,
    private srmUserService: SrmUserService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchExistingData();
    this.fetchUsers();

    this.filteredOptions = this.groupNameSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.takeRouteSnap();
  }

  takeRouteSnap = () => {
    this.activatedRoute.params.subscribe((res: any) => {
      this.userId = res.id;
      this.fetchExistingData();
    })
  }

  fetchUsers = () => {
    this.userService.fetchUsers().subscribe({
      next: (usersList: any) => {
        this.userList$ = usersList;
        this.fetchProfileInformation();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  fetchUserLog = () => {
    this.srmUserService.fetchUserLogs().subscribe(serviceRes => {
      if (serviceRes) {
        const filteredRes: any[] = serviceRes.filter(x => x.userId === this.userRef?.userId);
        this.userLogRef = filteredRes.map(x => {
          const user = this.userList$.find(x => x.sub === x.createdBy);
          x['nickname'] = user?.nickname
          return {
            ...x,
          }
        })
        this.userLogs = new MatTableDataSource(filteredRes);
      }
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  ngAfterViewInit(): void {
    if (this.userLogs) {
      this.userLogs.paginator = this.paginator;
      this.userLogs.sort = this.sort;
    }
  }

  fetchExistingData = () => {
    this.srmUserService.getUser(this.userId).subscribe(res => {
      if (res) { 
        this.userRef = res;
        this.imageUrl = this.userRef.userImageUrl;
        this.selectedUserGroups = this.userRef?.userGroups ? this.userRef?.userGroups.split(',') : [];
        this.userForm.patchValue({
          userName: this.userRef?.userName,
          email: this.userRef?.email,
          password: this.userRef?.password,
          fullName: this.userRef?.fullName,
          source: this.userRef?.source,
          loginMethod: this.userRef?.loginMethod,
          validFrom: this.userRef?.validFrom,
          validTo: this.userRef?.validTo,
          isActive: this.userRef?.isActive ? "1" : "2",
          defaultLang: this.userRef?.defaultLang,
          defaultCurrency: this.userRef?.defaultCurrency,
          userGroups: this.userRef?.userGroups,
        });
      }
    })
  }

  fetchProfileInformation = () => {
    this.authService.user$.subscribe((user: User) => {
      if (user) {
        this.userProfileInformation = user;
        this.fetchUserLog();
      }
    }, error => {
      console.log(error);
    })
  }

  initializeForm = () => {
    this.userForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null),
      fullName: new FormControl(null, Validators.required),
      source: new FormControl(null, Validators.required),
      loginMethod: new FormControl(null, Validators.required),
      validFrom: new FormControl(null, Validators.required),
      validTo: new FormControl(null, Validators.required),
      isActive: new FormControl(null, Validators.required),
      defaultLang: new FormControl(null),
      defaultCurrency: new FormControl(null),
      userGroups: new FormControl(null)
    })
  }

  userCreateaUpdate = () => {
    if (this.userForm.valid) {
      if (this.userRef) {
        // UPDATE
        this.userRef.userName = this.userForm.get('userName').value;
        this.userRef.email = this.userForm.get('email').value;
        this.userRef.password = this.userForm.get('password').value;
        this.userRef.fullName = this.userForm.get('fullName').value;
        this.userRef.source = this.userForm.get('source').value;
        this.userRef.loginMethod = this.userForm.get('loginMethod').value;
        this.userRef.validFrom = this.userForm.get('validFrom').value;
        this.userRef.validTo = this.userForm.get('validTo').value;
        this.userRef.defaultLang = this.userForm.get('defaultLang').value;
        this.userRef.defaultCurrency = this.userForm.get('defaultCurrency').value;
        this.userRef.userGroups = this.selectedUserGroups.toString();
        this.userRef.isActive = this.userForm.get('isActive').value === "1" ? true : false;
        this.userRef.UserImageUrl = this.imageUrl;
        this.userRef.createdBy = this.userProfileInformation?.sub;
        this.userRef.createdOn = new Date();
        this.userRef.updatedBy = this.userProfileInformation?.sub;
        this.userRef.updatedOn = new Date();
        this.userRef.userLog = {
          comment: "User Updatedation done.",
          createdOn: new Date(),
          CreatedBy: this.userProfileInformation.sub
        }

        this.srmUserService.updateUser(this.userRef).subscribe({
          next: (serviceRes: any) => {
            if (serviceRes) {
              this.srmUserService.afterSaveUpdate.emit(true);
              this.toastService.showToast(TYPE.SUCCESS, false, "Successfully updated.");
            }
          },
          error: (error: any) => {
            console.log(error);
            this.toastService.showToast(TYPE.ERROR, false, "Failed to save.");
          }
        });
      } else {
        // SAVE
        const userRequest = {
          userName: this.userForm.get('userName').value,
          email: this.userForm.get('email').value,
          password: this.userForm.get('password').value,
          fullName: this.userForm.get('fullName').value,
          source: this.userForm.get('source').value,
          loginMethod: this.userForm.get('loginMethod').value,
          validFrom: this.userForm.get('validFrom').value,
          validTo: this.userForm.get('validTo').value,
          defaultLang: this.userForm.get('defaultLang').value,
          defaultCurrency: this.userForm.get('defaultCurrency').value,
          userGroups: this.selectedUserGroups.toString(),
          isActive: this.userForm.get('isActive').value === "1" ? true : false,
          UserImageUrl: this.imageUrl,
          createdBy: this.userProfileInformation?.sub,
          createdOn: new Date(),
          userLog: {
            comment: "User added to the system",
            createdOn: new Date(),
            CreatedBy: this.userProfileInformation.sub
          }
        }

        this.srmUserService.saveUser(userRequest).subscribe({
          next: (serviceRes: any) => {
            if (serviceRes) {
              this.userId = serviceRes.userLog.userId;
              this.srmUserService.afterSaveUpdate.emit(true);
              this.toastService.showToast(TYPE.SUCCESS, false, "Successfully saved.");
            }
          },
          error: ({ error }: any) => {
            console.log(error);
          }
        });
      }
    } else {
      this.toastService.showToast(TYPE.ERROR, false, "Please check the form again.");
    }
  }

  uploadFileHandler = (event: any) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageUrl = reader.result;
      }
    }
  }

  onBackClick = () => {
    this.router.navigate(['./access-management/user/details'])
  }

  fileOverBase = (e: any): void => {
    this.hasBaseDropZoneOver = e;
  }

  showPw(): void {
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }
}
