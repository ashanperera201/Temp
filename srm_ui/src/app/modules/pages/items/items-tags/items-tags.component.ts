import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ItemDatatableComponent } from 'app/modules/common/item-datatable/item-datatable.component';
import { ItemTagsDatatableComponent } from 'app/modules/common/item-tags-datatable/item-tags-datatable.component';
import { ItemTagsDatatableModule } from 'app/modules/common/item-tags-datatable/item-tags-datatable.module';
import { environment } from 'environments/environment.prod';

@Component({
    selector: 'items-tags',
    templateUrl: './items-tags.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsTagsComponent {
    @ViewChild(ItemTagsDatatableComponent) child: ItemTagsDatatableComponent;
    userrole: string = '';
    tagselected: any = 0;

    templateData: any = [];
    constructor(private http: HttpClient) {
        this.userrole = localStorage.getItem("userrole");
        this.getTemplate();
        this.RemoveAllFilters();
    }

    getTemplate() {
        this.http.get<any>(environment.nodeurl + '/api/template/').subscribe(data => {
            this.templateData = data;
            this.tagselected = localStorage.getItem('templateId') ? Number(localStorage.getItem('templateId')) : this.templateData[0].templateId;

            this.changeSelected(this.tagselected);
        });
        // localStorage.removeItem('allfilter');
    }

    changeSelected(templateId) {
        this.tagselected = templateId;
        localStorage.setItem('templateId', templateId);
        this.http.get<any>(environment.nodeurl + '/api/template/querydata?templateId=' + templateId + '&role=' + this.userrole + '&type=N').subscribe(data => {

            var messagelist = data;

            this.child.filltabledata(messagelist, 'tags');

        });
    }

    RemoveAllFilters(){
        localStorage.removeItem('reportfilter');
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfilter-e');
        localStorage.removeItem('kpifilter');
      }
}

