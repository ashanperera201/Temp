import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EmailTemplateComponent } from './email-template.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';

const routes: Routes = [
    {
        path: 'landing', component: EmailTemplateComponent,
        children:
            [
                { path: '', component: EmailTemplatesComponent, pathMatch: 'full' },
                { path: '**', redirectTo: '' }
            ],
        pathMatch: 'full'
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailTemplateRoutingModule { }
