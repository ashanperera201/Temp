import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'items-reportaudit',
    templateUrl  : './items-reportaudit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsReportauditComponent
{
    constructor() {
        this.RemoveAllFilters();
    }

    RemoveAllFilters(){
        localStorage.removeItem('reportfilter');
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('allfiltertags');
        localStorage.removeItem('allfilter-e');
        localStorage.removeItem('kpifilter');
      }
}
