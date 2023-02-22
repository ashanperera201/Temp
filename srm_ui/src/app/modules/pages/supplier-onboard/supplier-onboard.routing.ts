import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SupplierOnboardComponent } from './supplier-onboard.component'

const routes: Routes = [
    { path: '', component: SupplierOnboardComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupplierOnboardRoutingModule { }
