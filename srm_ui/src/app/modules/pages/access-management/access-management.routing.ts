import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccessManagementComponent } from './access-management.component';

const routes: Routes = [
    {
        path: '', component: AccessManagementComponent, children:
            [
                { path: 'roles', loadChildren: () => import(`./role/role.module`).then(m => m.RoleModule) },
                { path: 'user', loadChildren: () => import(`./srm-user/srm-user.module`).then(m => m.SrmUserModule) },
                { path: '**', redirectTo: 'roles' }
            ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccessManagementRoutingModule { }
