import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SrmUserComponent } from './srm-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component'

const routes: Routes = [
    {
        path: '', component: SrmUserComponent, children: [
            { path: 'details', component: UsersListComponent },
            { path: 'create', component: UserCreateUpdateComponent },
            { path: 'update/:id', component: UserCreateUpdateComponent }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SrmUserRoutingModule { }
