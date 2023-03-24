import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions'

@Component({
    selector: 'items-reportall',
    templateUrl: './items-reportall.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsReportallComponent implements OnInit {

    constructor() {
        this.RemoveAllFilters();
    }

    ngOnInit(): void {
    }

    RemoveAllFilters() {
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfiltertags');
        localStorage.removeItem('allfilter-e');
        localStorage.removeItem('kpifilter');
    }
}
