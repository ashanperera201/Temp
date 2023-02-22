import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RolesService } from '../../../../../shared/Services/roles.service';
import { ToastService } from '../../../../../shared/Services/toast.service';
import { TYPE } from '../../../../../shared/enums/toast.enum';

@Component({
    selector: 'role-confirmation',
    templateUrl: './role-confirmation.component.html',
    styleUrls: ['./role-confirmation.component.scss']
})
export class RoleConfirmationComponent implements OnInit {

    roleId?: string;

    constructor(
        public matDialogRef: MatDialogRef<RoleConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rolesService: RolesService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.triggerExistingData();
    }

    triggerExistingData = () => {
        this.roleId = this.data;
    }

    closeModal = () => {
        this.matDialogRef.close();
    }

    onDeletion = () => {
        this.rolesService.deleteRole(this.roleId).subscribe({
            next: (serviceRes: any) => {
                if (serviceRes) {
                    this.rolesService.afterSaveUpdate.emit(true);
                    this.closeModal();
                    this.toastService.showToast(TYPE.SUCCESS, true, 'Successfully deleted.');
                }
            },
            error: () => {
                this.toastService.showToast(TYPE.ERROR, true, 'Failed to delete.');
            }
        })
    }
}
