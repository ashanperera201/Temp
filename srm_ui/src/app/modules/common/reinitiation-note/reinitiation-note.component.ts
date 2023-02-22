import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  reviewerName: string;
  reviewerId: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { reviewerId: 'SID 4467', reviewerName: 'Reviewer 1' },
  { reviewerId: 'SID 4468', reviewerName: 'Reviewer 2' },
  { reviewerId: 'SID 4469', reviewerName: 'Reviewer 3' },
];
@Component({
  selector: 'app-reinitiation-note',
  templateUrl: './reinitiation-note.component.html',
  styleUrls: ['./reinitiation-note.component.scss']
})
export class ReinitiationNoteComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  reviews: string[] = ['IT HW Supplier Evaluation', 'ZXY Corporation'];
  reviewReinitiation: string;
  reinitiationForm: FormGroup;

  displayedColumns: string[] = ['select', 'reviewerId', 'reviewerName'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  filterValues = {};
  reviewId: string;
  reviewName: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.reviewerId + 1}`;
  }

  //reset filters/data
  resetFilters(): void {
    this.filterValues = {};
    this.filterChange('', '');
  }

  //table filters
  filterChange(type, event): void {

    let value = '';
    value = event ? event.target.value.trim().toLowerCase() : '';

    const filterValue = value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (type === 'reviewerId') {
      this.dataSource.filterPredicate = (data, filter: any): boolean => data.reviewerId.toLowerCase().includes(filter);
    } else if (type === 'reviewerName') {
      this.dataSource.filterPredicate = (data, filter: any): boolean => data.reviewerName.toLowerCase().includes(filter);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  submitForm(): void { }
}
