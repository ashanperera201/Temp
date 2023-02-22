import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'items-reportall',
    templateUrl  : './items-reportall.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsReportallComponent
{
    constructor() {
        this.RemoveAllFilters();
    }

    RemoveAllFilters(){
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfiltertags');
        localStorage.removeItem('allfilter-e');
        localStorage.removeItem('kpifilter');
      }
}
