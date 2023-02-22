import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { RolesService } from '../../../../../shared/Services/roles.service';
import { ToastService } from '../../../../../shared/Services/toast.service';
import { USER_PERMISSIONS_CONFIGURATION } from '../../../../../data/mock-permission-data';
import { TYPE } from '../../../../../shared/enums/toast.enum';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'permission-visibility-create-update',
  templateUrl: './permission-visibility-create-update.component.html',
  styleUrls: ['./permission-visibility-create-update.component.scss']
})
export class PermissionCreateUpdateComponent implements OnInit, OnDestroy {

  permissionSubscriptions: Subscription[] = [];
  userPermissionConfigurations: any;

  userProfileInformation: User;
  role: any;
  userCollectedPermission: any[] = [];
  permissionVisibilityRef: any;

  constructor(
    public matDialogRef: MatDialogRef<PermissionCreateUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rolesService: RolesService,
    private toastService: ToastService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.extractPassedRole();
    this.fetchProfileInformation();
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

  extractPassedRole = () => {
    this.role = this.data
    if (this.role) {
      this.rolesService.getVisibilityConfigByRole(this.role.id).subscribe({
        next: (serviceRes: any) => {
          if (serviceRes && serviceRes.length > 0 && serviceRes[0]?.visibilityPermissionJson) {
            this.permissionVisibilityRef = serviceRes[0];
            this.userPermissionConfigurations = JSON.parse(serviceRes[0]?.visibilityPermissionJson);
          } else {
            this.userPermissionConfigurations = USER_PERMISSIONS_CONFIGURATION;
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  onEditChange = (event: any) => {
    const { moduleCode, permissionRef, subCategory } = event;
    this.userPermissionConfigurations.map(x => {
      if (x.moduleCode === moduleCode) {
        x.subCategories.map(sc => {
          if (sc.categoryCode === subCategory.categoryCode) {
            sc.fieldLevels.map(fl => {
              if (fl.levelCode === permissionRef?.levelCode) {
                fl.formItems?.map(frm => {
                  if (frm?.formCode === permissionRef?.formCode) {
                    frm?.fields?.map(fd => {
                      if (fd?.editFieldCode === permissionRef?.editFieldCode) { 
                        fd.edit = !fd.edit;
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  onViewChange = (event: any) => {
    const { moduleCode, permissionRef, subCategory } = event;
    this.userPermissionConfigurations.map(x => {
      if (x.moduleCode === moduleCode) {
        x.subCategories.map(sc => {
          if (sc.categoryCode === subCategory.categoryCode) {
            sc.fieldLevels.map(fl => {
              if (fl.levelCode === permissionRef?.levelCode) {
                fl.formItems?.map(frm => {
                  if (frm?.formCode === permissionRef?.formCode) {
                    frm?.fields?.map(fd => {
                      if (fd?.viewFieldCode === permissionRef?.viewFieldCode) { 
                        fd.view = !fd.view;
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  onPermissionChange = (event: any) => {
    const { selectedPermission, moduleCode, categoryCode } = event;

    this.userPermissionConfigurations.map(x => {
      if (x.moduleCode === moduleCode) {
        x.subCategories.map(sc => {
          if (sc.categoryCode === categoryCode) {
            sc.visibilityConfig.map(vc => {
              vc.subItems.map(si => {
                si.permissions.map(p => {
                  if (p.permissionCode === selectedPermission.permissionCode) {
                    // ACTIVE STATUS
                    p.active = !p.active;

                    // VISIBILITY OF NEXT CONFIG.
                    if (vc.levelCode !== p.levelsAvailable) {
                      sc.visibilityConfig.map(x => {

                        const isChanged = sc.visibilityConfig.some(vc => vc.id > x.id && vc.show);

                        if (!isChanged) {
                          if (p.subItemCode === selectedPermission.subItemCode) {
                            x.subItems.map(i => {
                              if (i.subItemCode === selectedPermission.subItemCode) {
                                i.showSubItem = !i.showSubItem;
                              }
                            })
                          }
                          const subItems = x.subItems.filter(x => x.showSubItem);
                          if (x.levelCode === p.levelsAvailable && !x.show) {
                            x.show = p.active ? true : subItems.length === 0 ? false : true;
                          }
                          if (x.levelCode === p.levelsAvailable && x.show && subItems.length === 0) {
                            x.show = !p.active ? false : true;
                          }
                        } else {
                          x.show = true;
                        }
                      });
                    }
                  }
                });
              });
            });
          }
        });
      }
    });
  }

  saveConfig = (event: boolean) => {
    if (event) {
      if (this.permissionVisibilityRef) {
        // UPDATE
        const updatePermissionPayload = {
          id: this.permissionVisibilityRef.id,
          roleId: this.permissionVisibilityRef.roleId,
          visibilityPermissionJson: JSON.stringify(this.userPermissionConfigurations),
          isActive: this.permissionVisibilityRef.isActive,
          createdBy: this.permissionVisibilityRef.createdBy,
          createdOn: this.permissionVisibilityRef.createdOn,
          updatedBy: this.userProfileInformation.sub,
          updatedOn: new Date()
        }
        this.permissionSubscriptions.push(this.rolesService.saveUpdateVisibilityConfig(updatePermissionPayload).subscribe({
          next: (serviceRes: any) => {
            if (serviceRes) {
              this.toastService.showToast(TYPE.SUCCESS, true, 'Successfully updated.');
            }
          },
          error: (error: any) => {
            console.log(error);
          }
        }))
      } else {
        // SAVE
        const visibilityConfigPayload = {
          roleId: this.role.id,
          visibilityPermissionJson: JSON.stringify(this.userPermissionConfigurations),
          isActive: true,
          createdBy: this.userProfileInformation.sub,
          createdOn: new Date(),
        }
        this.permissionSubscriptions.push(this.rolesService.saveUpdateVisibilityConfig(visibilityConfigPayload).subscribe({
          next: (serviceRes: any) => {
            if (serviceRes) {
              this.toastService.showToast(TYPE.SUCCESS, true, 'Successfully saved.');
              this.closeModal();
            }
          },
          error: (error: any) => {
            console.log(error);
          }
        }))
      }
    }
  }

  ngOnDestroy(): void {
    if (this.permissionSubscriptions && this.permissionSubscriptions.length > 0) {
      this.permissionSubscriptions.forEach(s => s.unsubscribe());
    }
  }
}
