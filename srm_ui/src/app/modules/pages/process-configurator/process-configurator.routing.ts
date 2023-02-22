import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProcessConfiguratorComponent } from './process-configurator.component';
import { ProcessConfiguratorLandingComponent } from './process-configurator-landing/process-configurator-landing.component';

const routes: Routes = [
    {
        path: '', component: ProcessConfiguratorComponent, children: [
            { path: 'landing', component: ProcessConfiguratorLandingComponent },
        ]
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessRoutingModule { }
