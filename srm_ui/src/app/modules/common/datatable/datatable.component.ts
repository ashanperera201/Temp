import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface UserData {
    id: string;
    name: string;
    position: string;
    email: string;
    country: string;
    criticality: string;
}

/** Constants used to fill up our data base. */
const EMAILS: string[] = [
    'email14@gmail.com', 'emai234@gmail.com', 'email34@gmail.com', 'email1234@gmail.com', 'email1234@gmail.com', 'email1234@gmail.com', 'email34@gmail.com', 'emai234@gmail.com'
];
const NAMES: string[] = [
    'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
    'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
const POSITIONS: string[] = [
    'Position one', 'Position two', 'Position three', 'Position four', 'Position five', 'Position six', 'Position'
];
const COUNTRY: string[] = [
   'US', 'TR', 'AU', 'RU', 'SA'
];
const CRITICALITY: string[] = [
    'one', 'two', 'three', 'four'
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'datatable',
    styleUrls: ['datatable.component.scss'],
    templateUrl: 'datatable.component.html',
})
export class DatatableComponent implements AfterViewInit {
    displayedColumns: string[] = ['id', 'position', 'name', 'criticality', 'email', 'country'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor() {
        // Create 100 users
        const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

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
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
        id: id.toString(),
        name: name,
        position: POSITIONS[Math.round(Math.random() * (POSITIONS.length - 1))],
        country: COUNTRY[Math.round(Math.random() * (COUNTRY.length - 1))],
        criticality: CRITICALITY[Math.round(Math.random() * (CRITICALITY.length - 1))],
        email: EMAILS[Math.round(Math.random() * (EMAILS.length - 1))]
    };
}
