import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as moment from 'moment';
;
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

export interface DashboardElement {
    interfaceddate: string;
    error: string;
    userrole:string;
    category:string;
  }
  
const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

@Component({
    selector: 'items-ifs-inner',
    templateUrl: './items-ifs-inner.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})

export class ItemsIfsInnerComponent {
    apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');

    dataSourceDashboardList: any = [];
    dataSourceNew = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
    displayedColumns: string[] = ['position','interfaceddate','error','userrole','category'];
    supplier_id = '';
    supplier_code = '';

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private datePipe: DatePipe) {

        this.supplier_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getSupplierHistory();

        
    }

    ngOnInit(): void {
    }

    async getSupplierHistory() {

        this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+this.supplier_id).subscribe(data2 => {
            if (data2) {
                var messagelist = data2;
                this.filltabledata(messagelist, 'all');
            } else {
            }
            setTimeout(function () {
                this.issuccess = false;
                this.iserror = false;
            }.bind(this), 2000);
        });
    }

    filltabledata(data: any, page: string) {
        if (data) {
            this.dataSourceDashboardList = [];

            data.forEach(element => {
            var interfaceddate=moment(new Date(element.interfacedDate)).format('YYYY-MM-DD') == '1900-01-01' ? '' : this.datePipe.transform(element.interfacedDate, 'dd-MMM-yyyy, HH:mm');
              this.dataSourceDashboardList.push(
                {
                    error: element.error,
                    interfaceddate: interfaceddate,
                    userrole: element.userrole,
                    category: element.category
                }
              )
            });
      
            this.dataSourceNew = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
          }
    }
}
