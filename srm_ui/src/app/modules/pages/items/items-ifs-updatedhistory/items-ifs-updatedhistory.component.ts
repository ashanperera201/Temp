import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as moment from 'moment';
;
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface DashboardElement {
    interfaceddate: string;
    useremail: string;
    username:string;
    fieldname:string;
    changedfrom:string;
    changedto:string;
  }
  
const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

@Component({
    selector: 'items-ifs-updatedhistory',
    templateUrl: './items-ifs-updatedhistory.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})

export class ItemsIfsUpdatedHistoryComponent {
    apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');
    @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;

    dataSourceDashboardList: any = [];
    dataSourceNew = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
    displayedColumns: string[] = ['position','interfaceddate','useremail','username','fieldname','changedfrom', 'changedto'];
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

        this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailedupdatedhistory?supplierID='+this.supplier_id).subscribe(data2 => {
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
            var interfaceddate=moment(new Date(element.interfacedDate)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.interfacedDate)).format('YYYY-MM-DD HH:MM');

              this.dataSourceDashboardList.push(
                {
                    interfaceddate: element.interfacedDate,
                    useremail: element.changerEmail,
                    username:element.changerName,
                    fieldname:element.fieldName,
                    changedfrom:element.changedFrom,
                    changedto:element.changedTo
                }
              )
            });
      
            this.dataSourceNew = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
            this.dataSourceNew.paginator = this.tableOnePaginator;

          }
    }
}
