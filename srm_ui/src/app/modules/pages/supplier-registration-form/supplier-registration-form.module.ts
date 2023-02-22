import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SupplierRegistrationFormComponent } from './supplier-registration-form.component';
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
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DatatableModule} from '../../common/datatable/datatable.module';
import { MatDialogModule } from '@angular/material/dialog';
import {OverlayComponent} from '../../common/overlay/overlay.component';
import { MatTableModule } from '@angular/material/table';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModal,NgbModule, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatPaginator } from '@angular/material/paginator';
import {MatTooltipModule} from "@angular/material/tooltip";
import { DisableAfterClickDirective } from './disable-after-click.directive';
import { SupplierEvaluationComponent } from '../supplier-evaluation/supplier-evaluation.component';

const supplierRegistrationFormRoutes: Route[] = [
    {
        path     : '',
        component: SupplierRegistrationFormComponent
    }
    // {
    //     path     : 'supplier-registration-form',
    //     component: SupplierRegistrationFormComponent
    // },
    // {
    //     path        : 'supplier-registration-form/:id',
    //     component: SupplierRegistrationFormComponent
    // },
    // {
    //     path        : 'supplier-registration-form/:id/:cat',
    //     component: SupplierRegistrationFormComponent
    // }
];

@NgModule({
    declarations: [
        SupplierRegistrationFormComponent,
        SupplierEvaluationComponent,
        DialogBoxComponent,
        DisableAfterClickDirective
    ],
    imports: [
        RouterModule.forChild(supplierRegistrationFormRoutes),
        MatExpansionModule,
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        MatPaginatorModule,
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
        MatTableModule,
        FileUploadModule,
        NgbModule,
        MatTooltipModule
        // MatPaginator
    ],
    exports: [
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatTableModule
        // MatPaginator
      
    ]
})
export class SupplierRegistrationFormModule
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
