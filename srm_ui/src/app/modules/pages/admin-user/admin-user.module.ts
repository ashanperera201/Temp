import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminUserComponent } from './admin-user.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../../shared/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DatatableModule} from '../../common/datatable/datatable.module';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from "@angular/material/tooltip";
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';

const adminUserRoutes: Route[] = [
    {
        path     : '',
        component: AdminUserComponent
    }
];

@NgModule({
    declarations: [
        AdminUserComponent,
    ],
    imports: [
        RouterModule.forChild(adminUserRoutes),
        MatExpansionModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        MatDatepickerModule,
        MatMomentDateModule,
        DatatableModule,
        MatDialogModule,
        MatTooltipModule
    ],
    providers: [NotificationsComponent]
})
export class AdminUserModule
{
    toppings: FormGroup;
    constructor(fb: FormBuilder) {
        this.toppings = fb.group({
            pepperoni: false,
            extracheese: false,
            mushroom: false
        });
    }
}
