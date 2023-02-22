import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { reverse } from 'lodash';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Interface } from 'readline';

/**
 * @title Table with expandable rows
 */

export interface Suppliers1 {
  value: string,
  viewValue: string
}

@Component({
  selector: 'block_suppliers1',
  styleUrls: ['block_suppliers1.scss'],
  templateUrl: 'block_suppliers1.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class block_suppliers1Component {
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = ['SupplierNo', 'SupplierName', 'action'];
  expandedElement: PeriodicElement | null;

  suppliers1: Suppliers1[] = [
    { value: 'sid 3421', viewValue: 'sid 3421' },
    { value: 'sid 0004', viewValue: 'sid 0004' },
  ]

  resetFilter(): void {
    this.dataSource.filter = '';
    this.dataSource = new MatTableDataSource(ELEMENT_DATA)
  }

  filterData(type, value): void {
    this.resetFilter();

    const FilterValue = value;
    this.dataSource.filter = FilterValue.trim().toLowerCase();
    if (type === 'SupplierNo') {
      this.dataSource.filterPredicate = (data, filter: any): boolean => data.SupplierNo.toLowerCase().includes(filter);
    }
    if (type === 'SupplierName') {
      this.dataSource.filterPredicate = (data, filter: any): boolean => data.SupplierName.toLowerCase().includes(filter);
    }

  }

  saveTable(): void {
    console.log(this.dataSource)
  }

  updateRow(row, value, i): void {
    console.log(row, value);
    var obj = row;
    Object.assign(obj, {message:value})

    this.dataSource.data[i] = obj;
  }
}

export interface PeriodicElement {
  SupplierNo: string;
  SupplierName: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {
    SupplierNo: 'sid 3421',
    SupplierName: 'xyz Corporation',
  },
  {
    SupplierNo: 'sid 0004',
    SupplierName: 'abc Corporation',
  },

];


