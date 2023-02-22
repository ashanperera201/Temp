import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'items-task',
    templateUrl  : './items-task.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsTaskComponent
{
    constructor() {
        this.RemoveAllFilters();
    }

    RemoveAllFilters(){
        localStorage.removeItem('reportfilter');
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfiltertags');
        localStorage.removeItem('allfilter-e');
        localStorage.removeItem('kpifilter');
      }
}
