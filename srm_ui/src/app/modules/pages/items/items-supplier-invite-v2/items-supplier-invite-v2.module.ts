import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { ItemsSupplierInviteV2Component } from './items-supplier-invite-v2.component';
import { ItemsSupplierV2RoutingModule } from './items-supplier-invite-v2.routing';
import { DrawerMiniModule } from '../../../common/drawer-mini/drawer-mini.module';
import { NgxSurveyModule } from '../../form-builder/ngx-survey';

@NgModule({
    declarations: [
        ItemsSupplierInviteV2Component
    ],
    imports: [
        CommonModule,
        ItemsSupplierV2RoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        DrawerMiniModule,
        NgxSurveyModule,
    ],
    exports: [
        ItemsSupplierInviteV2Component,
    ],
    providers: [],
})
export class ItemsSupplierV2Module { }
