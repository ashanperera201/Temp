import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { DatatableModule } from '../../../common/datatable/datatable.module';
import { DrawerMiniModule } from '../../../common/drawer-mini/drawer-mini.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '../../../../shared/shared.module';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadModule } from 'ng2-file-upload';
import { EmergencyHistoryModule } from 'app/modules/common/emergency-history/emergency-history.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemsIfsEditComponent } from './items-ifs-edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

const itemsEmergencySupplierInnerRoutes: Route[] = [
    {
        path: '',
        component: ItemsIfsEditComponent
    },
];

@NgModule({
    declarations: [
        ItemsIfsEditComponent,
        DialogBoxComponent,
    ],
    imports: [
        RouterModule.forChild(itemsEmergencySupplierInnerRoutes),
        MatExpansionModule,
        CommonModule,
        DrawerMiniModule,
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
    ],exports: [
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatTableModule
        // MatPaginator
      
    ]
})
export class ItemsIfsEditModule {
}