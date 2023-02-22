import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { RFXTemplateSearchModel } from "app/main/Models/etendering/rfx-template-search-model";
import { RFXTemplateService } from 'app/shared/Services/etendering/rfx-template.service';


@Component({
    selector     : 'rfx',
    templateUrl  : './rfx-new-from-existing.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RfxNewFromExistingComponent
{
    displayedColumns: string[] = ['id', 'number', 'createdDate', 'name', 'description', 'type', 'status'];
    pageEvent: PageEvent;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;
    /**
     * Constructor
     */
     rfxTemplates: any;
     rfxSearchTemplates: any = new RFXTemplateSearchModel();
    constructor(private rfqService:RfqService,public dialog: MatDialog,private router: Router
        , private rfxTemplateService: RFXTemplateService)
    {
        this.rfxSearchTemplates.pageSize = 10;
        this.rfxSearchTemplates.page = 1;
    }
    FetchBasicData() {
        // //debugger;
 
         this.rfxTemplateService.getRFXList(this.rfxSearchTemplates).subscribe(result => {
             debugger;
           //  //debugger;
             this.rfxTemplates = result;
             if(this.rfxTemplates)
             {
                 if(this.rfxTemplates.length>0)
                 {
                     this.rfxSearchTemplates.totalItems=this.rfxTemplates[0].totalRows;
                     
                 } 
             }
         });
 
     }
     ngOnInit() {
         this.FetchBasicData();
 
     }
    rfqid:any;
    OnInputTypeChange(row)
    {
        this.rfqid=row.rfqid;
        
        
    }
    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.rfxSearchTemplates.pageSize = event.pageSize;
        this.rfxSearchTemplates.page = page;
        this.FetchBasicData();
        //  this.dataSource=   this.CreatePaginationData(page,size);

    }
    OpenURL(url) {
        this.router.navigateByUrl(url, { state: { hello: 'world' } });
    }
    CreateRFX(url) {
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Processing....' } });       
        this.rfqService.createRFQFromTemplate(this.rfqid).subscribe(result => {
            refference.close();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "RFX Created successfully",
                showConfirmButton: true
            }).then((result1) => {
                this.router.navigateByUrl(url + "/" + result.data.id, { state: { Id: result.data.id} });
            });;
            
        });
    }
}

