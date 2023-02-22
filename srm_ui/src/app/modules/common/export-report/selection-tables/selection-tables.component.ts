import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-selection-tables',
  templateUrl: './selection-tables.component.html',
  styleUrls: ['../export-report.component.scss']
})
export class SelectionTablesComponent implements OnInit {
  @Input() dataSource;
  @Input() columns;
  @Input() displayedColumns;
  @Input() extraColumn_newTable;

  constructor() { }

  ngOnInit(): void {
  }

}
