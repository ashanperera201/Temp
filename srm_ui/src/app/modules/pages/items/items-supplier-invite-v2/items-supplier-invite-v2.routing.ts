import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ItemsSupplierInviteV2Component } from './items-supplier-invite-v2.component';

const routes: Routes = [
    { path: '', component: ItemsSupplierInviteV2Component },
    { path: ':id', component: ItemsSupplierInviteV2Component },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemsSupplierV2RoutingModule { }
