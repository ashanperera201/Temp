import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-evaluation-tables',
    templateUrl: './evaluation-tables.component.html',
    styleUrls: ['./evaluation-tables.component.scss'],
})
export class EvaluationTablesComponent implements OnInit {
    @Input() dataSource;
    @Input() columnNames;
    // @Input() displayedColumns;
    @Input() title;

    capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    constructor() {}

    ngOnInit(): void {}
}
