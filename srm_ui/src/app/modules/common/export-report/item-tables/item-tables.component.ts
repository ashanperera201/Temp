import { Component, DoCheck, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogData } from '../../overlay/overlay.component';

@Component({
  selector: 'app-item-tables',
  templateUrl: './item-tables.component.html',
  styleUrls: ['./item-tables.component.scss']
})
export class ItemTablesComponent implements OnInit, DoCheck {
  @Input() dataSource;
  @Input() columns;
  @Input() displayedColumns;



  constructor() {
   }

  ngDoCheck(): void {
    // throw new Error('Method not implemented.');
  }


  ngOnInit() {
    
  }






}
