import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface TableElement {
  reviewerName: string;
  reviewerId: string;
}

const ELEMENT_DATA: TableElement[] = [
  { reviewerId: 'SID 4467', reviewerName: 'Reviewer 1' },
  { reviewerId: 'SID 4468', reviewerName: 'Reviewer 2' },
  { reviewerId: 'SID 4469', reviewerName: 'Reviewer 3' },
];

const SELECTED_DATA: TableElement[] = [
  { reviewerId: 'SID 4470', reviewerName: 'Reviewer 4' },
  { reviewerId: 'SID 4471', reviewerName: 'Reviewer 5' },
  { reviewerId: 'SID 4472', reviewerName: 'Reviewer 6' },
];
@Component({
  selector: 'app-supplier-review-reinitiation',
  templateUrl: './supplier-review-reinitiation.component.html',
  styleUrls: ['./supplier-review-reinitiation.component.scss']
})
export class SupplierReviewReinitiationComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  reviews: string[] = ['All Reviewers', 'Custom'];
  reviewReinitiation: string;
  supplierViewForm: FormGroup;

  displayedColumns: string[] = ['select', 'reviewerId', 'reviewerName'];
  displayedSelectedColumns: string[] = ['select', 'reviewerId', 'reviewerName', 'action'];
  dataSource = new MatTableDataSource<TableElement>(ELEMENT_DATA);
  dataSourceSelected = new MatTableDataSource<TableElement>(SELECTED_DATA);
  selection = new SelectionModel<TableElement>(true, []);
  selectionTable2 = new SelectionModel<TableElement>(true, []);

  filterValues = {};
  reviewId: string;
  reviewName: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.supplierViewForm = this.fb.group({
      reviewReinitiation: ['']
    });
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
  checkboxLabel(row?: TableElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.reviewerId + 1}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedTable2() {
    const numSelected = this.selectionTable2.selected.length;
    const numRows = this.dataSourceSelected.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSelected(): void {
    if (this.isAllSelectedTable2()) {
      this.selectionTable2.clear();
      return;
    }

    this.selectionTable2.select(...this.dataSourceSelected.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelSelected(row?: TableElement): string {
    if (!row) {
      return `${this.isAllSelectedTable2() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionTable2.isSelected(row) ? 'deselect' : 'select'} row ${row.reviewerId + 1}`;
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

  deleteRow(element, i): void {
    this.dataSourceSelected.data.splice(i, 1);
    this.dataSourceSelected.data = this.dataSourceSelected.data;

    this.dataSource.data.push(element);
    this.dataSource.data = this.dataSource.data;
  }

  selectRow(row, i): void {
    this.dataSource.data.splice(i, 1);
    this.dataSourceSelected.data.push(row);
    this.dataSource.data = this.dataSource.data;
    this.dataSourceSelected.data = this.dataSourceSelected.data;
  }

  submitForm(): void {
  }
}
