/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { SelectionModel } from '@angular/cdk/collections';
import {
    Component,
    DoCheck,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData } from 'app/modules/common/overlay/overlay.component';
import { PeriodicElement } from 'app/modules/pages/block_suppliers1/block_suppliers1.component';
import { User } from '../supplier-review-models';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, DoCheck {
    @Input() columns: any;
    @Input() displayedColumns: any;
    @Input() dataSource: any;
    @Input() names: any;
    @Input() selectedTable: any;
    @Input() disabled: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() selectedRow = new EventEmitter();
    @Output() unselectedRow = new EventEmitter();
    selection = new SelectionModel<User>(true, []);
    displayedColumns1: any[];
    firstTime: boolean = false;
    selectedUser: string[] = [];
    selectedSuppliers: string[] = [];
    selectedGroup: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<TableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        //this.data = data;
        /*  this.dataSource = new MatTableDataSource(this.data.source);
      this.displayedColumns = this.data.dis;
      this.columns = this.data.col; */
    }

    ngOnInit(): void {
        //this.dataSource = this.dataSource;
        this.displayedColumns = ['select', ...this.displayedColumns];
    }

    ngAfterViewInit(): void {
        if (this.dataSource !== undefined) {
            this.dataSource.data.forEach((element) => {
                element.tableName = this.names;
            });
            setTimeout(() => {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }, 500);
        }
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /** Whether the number of selectedUser elements matches the total number of rows. */
    isAllSelected() {
        if (this.dataSource !== undefined) {
            const numSelected = this.selection.selected?.length;
            const numRows = this.dataSource.data?.length;
            return numSelected === numRows;
        }

    }

    /** Selects all rows if they are not all selectedUser; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: User): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1
            }`;
    }

    ngDoCheck(): void {
        if (!this.firstTime) {
            if (this.selectedTable !== undefined && this.selectedTable?.length !== 0) {
                this.selection.select(...this.selectedTable);
                if (this.names === 'allUser') {
                    this.selectedUser = [...this.selectedTable];
                } else if (this.names === 'allRoles') {
                    this.selectedGroup = [...this.selectedTable];
                } else {
                    this.selectedSuppliers = [...this.selectedTable];
                }
                this.firstTime = true;
            }
        }

    }

    clickedRows(row, $event): void {
        if ($event.checked) {
            this.selection.select(row);
            if (this.names === 'allUser') {
                this.selectedUser.push(row);
            } else if (this.names === 'allRoles') {
                this.selectedGroup.push(row);
            } else {
                this.selectedSuppliers.push(row);
            }

            this.selectedRow.emit(this.selection);
        } else {
            this.selection.deselect(row);
            if (this.selection.selected?.length !== 0) {
                this.selectedRow.emit(this.selection);
            } else {
                this.unselectedRow.emit(this.names);
                if (this.names === 'allUser') {
                    this.selectedUser = [];
                } else if (this.names === 'allRoles') {
                    this.selectedGroup = [];
                } else {
                    this.selectedSuppliers = [];
                }
            }

        }
    }

    clickedRowsAll($event) {
        if ($event.checked) {
            this.dataSource.filteredData.forEach((element) => {
                element.tableName = this.names;
                this.selection.select(element);
                if (this.names === 'allUser') {
                    this.selectedUser.push(element);
                } else if (this.names === 'allRoles') {
                    this.selectedGroup.push(element);
                } else {
                    this.selectedSuppliers.push(element);
                }
            });

            this.selectedRow.emit(this.selection);
        } else {
            this.selection.clear();
            this.unselectedRow.emit(this.names);
            if (this.names === 'allUser') {
                this.selectedUser = [];
            } else if (this.names === 'allRoles') {
                this.selectedGroup = [];
            } else {
                this.selectedSuppliers = [];
            }
        }

    }

    remove(x): void {
        const index = this.selectedUser.indexOf(x);
        const row = this.selection.deselect(x);

        if (index >= 0) {
            this.selectedUser.splice(index, 1);
            this.selectedRow.emit(this.selection);
        }
    }
    removeGroup(x): void {
        const index = this.selectedGroup.indexOf(x);
        const row = this.selection.deselect(x);

        if (index >= 0) {
            this.selectedGroup.splice(index, 1);
            this.selectedRow.emit(this.selection);
        }
    }
    removeSuppliers(x): void {
        const index = this.selectedSuppliers.indexOf(x);
        const row = this.selection.deselect(x);

        if (index >= 0) {
            this.selectedSuppliers.splice(index, 1);
            this.selectedRow.emit(this.selection);
        }
    }
}
