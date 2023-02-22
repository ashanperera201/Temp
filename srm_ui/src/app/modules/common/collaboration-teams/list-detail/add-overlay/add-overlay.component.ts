import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

export interface RowData {
    id: string;
    name: string;
    position: string;
    email: string;

}
/** Constants used to fill up our data base. */
const NAME: string[] = [
    'Abdul Bilall', 'Rameez Raja'
];
const POSITION: string[] = [
    'SME - Engineering', 'Category Manager'
];
const EMAIL: string[] = [
    'Text@abc.com', 'Text@abc.com'
];

@Component({
    selector: 'add-overlay',
    templateUrl: './add-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'position', 'email'];
    dataSource: MatTableDataSource<RowData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });


    constructor(public dialogRef: MatDialogRef<AddOverlayComponent>,
                public dialog: MatDialog
    ) {
        const users = Array.from({length: 100}, (_, k) => createNewRow(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    addTemplate(item, event) {
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;

    }

    saveTemplate() {
    }
}
/** Builds and returns a new createNewRow. */
function createNewRow(id: number): RowData {

    return {
        id: id.toString(),
        name: NAME[Math.round(Math.random() * (NAME.length - 1))],
        position: POSITION[Math.round(Math.random() * (POSITION.length - 1))],
        email: EMAIL[Math.round(Math.random() * (EMAIL.length - 1))],
    };
}
