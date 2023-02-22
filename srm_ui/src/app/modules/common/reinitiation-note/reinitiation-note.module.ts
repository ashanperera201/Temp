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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReinitiationNoteComponent } from './reinitiation-note.component';
import { MatRadioModule } from '@angular/material/radio';

const reinitiationNoteRoutes: Route[] = [
    {
        path: '',
        component: ReinitiationNoteComponent,
    },
];

@NgModule({
    declarations: [ReinitiationNoteComponent],
    imports: [
        RouterModule.forChild(reinitiationNoteRoutes),
        MatExpansionModule,
        MatIconModule,
        CommonModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatSelectModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
    ],
    exports: [ReinitiationNoteComponent],
})
export class ReinitiationNoteModule { }
