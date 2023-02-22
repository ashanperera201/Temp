import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '@auth0/auth0-angular';

import { ToastService } from '../../../../../shared/Services/toast.service';
import { TYPE } from '../../../../../shared/enums/toast.enum';
import { RolesService } from '../../../../../shared/Services/roles.service';

@Component({
  selector: 'role-create-update',
  templateUrl: './role-create-update.component.html',
  styleUrls: ['./role-create-update.component.scss']
})
export class RoleCreateUpdateComponent implements OnInit, OnDestroy {

  roleForm: FormGroup;
  roleRef: any;
  userProfileInformation: User;

  constructor(
    public matDialogRef: MatDialogRef<RoleCreateUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    private rolesService: RolesService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchProfileInformation();
    this.fetchExistingData();
  }

  fetchExistingData = () => {
    this.roleRef = this.data;
    if (this.roleRef) {
      this.roleForm.patchValue({
        roleName: this.roleRef?.roleName,
        roleDescription: this.roleRef?.roleDescription,
        roleStatus: this.roleRef?.isActive,
        roleType: this.roleRef?.roleType === 'External' ? true : false,
      });
    }
  }

  fetchProfileInformation = () => {
    this.authService.user$.subscribe((user: User) => {
      if (user) {
        this.userProfileInformation = user;
      }
    }, error => {
      console.log(error);
    })
  }

  initializeForm = () => {
    this.roleForm = new FormGroup({
      roleName: new FormControl(null, Validators.required),
      roleDescription: new FormControl(null, Validators.required),
      roleStatus: new FormControl(false),
      roleType: new FormControl(false)
    })
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  onRoleSaveUpdate = () => {
    if (this.roleForm.valid) {
      if (this.roleRef) {
        // UPDATE
        this.roleRef.roleName = this.roleForm.get('roleName')?.value;
        this.roleRef.roleCode = this.roleForm.get('roleName')?.value;
        this.roleRef.roleDescription = this.roleForm.get('roleDescription')?.value;
        this.roleRef.roleType = this.roleForm.get('roleType')?.value ? "External" : "Internal";
        this.roleRef.roleAssignedUserId = this.userProfileInformation?.sub;
        this.roleRef.isActive = this.roleForm.get('roleStatus')?.value;
        this.roleRef.createdBy = this.userProfileInformation?.sub;
        this.roleRef.updatedBy = this.userProfileInformation?.sub;


        this.rolesService.updateRole(this.roleRef).subscribe({
          next: (roleServiceRef: any) => {
            if (roleServiceRef) {
              this.rolesService.afterSaveUpdate.emit(true);
              this.toastService.showToast(TYPE.SUCCESS, false, "Successfully updated.");
              this.closeModal();
            }
          },
          error: (error: any) => {
            console.log(error);
            this.toastService.showToast(TYPE.ERROR, false, "Failed to save.");
          }
        });
      } else {
        // SAVE
        const roleRequest = {
          roleName: this.roleForm.get('roleName')?.value,
          roleCode: this.roleForm.get('roleName')?.value,
          roleDescription: this.roleForm.get('roleDescription')?.value,
          roleType: this.roleForm.get('roleType')?.value ? "External" : "Internal",
          roleAssignedUserId: this.userProfileInformation?.sub,
          isActive: this.roleForm.get('roleStatus')?.value,
          createdBy: this.userProfileInformation?.sub
        }
        this.rolesService.saveRole(roleRequest).subscribe({
          next: (roleServiceRef: any) => {
            if (roleServiceRef) {
              this.rolesService.afterSaveUpdate.emit(true);
              this.toastService.showToast(TYPE.SUCCESS, false, "Successfully saved.");
              this.closeModal();
            }
          },
          error: ({ error }: any) => {
            this.toastService.showToast(TYPE.ERROR, false, error === 'T' ? "This role is already exists." : "Failed to save role.");
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
  }

}
