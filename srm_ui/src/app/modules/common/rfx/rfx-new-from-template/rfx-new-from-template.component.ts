import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { RFXTemplateService } from 'app/shared/Services/etendering/rfx-template.service';
import { RFXTemplateSearchModel } from "app/main/Models/etendering/rfx-template-search-model";
import { Router } from '@angular/router';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';



@Component({
    selector: 'rfx',
    templateUrl: './rfx-new-from-template.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RfxNewFromTemplateComponent {
    displayedColumns: string[] = ['id', 'name', 'description', 'type'];

    pageEvent: PageEvent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;
    /**
     * Constructor
     */
    rfxTemplates: any;
    rfxSearchTemplates: any = new RFXTemplateSearchModel();
    constructor(private rfqService:RfqService,public dialog: MatDialog
        , private rfxTemplateService: RFXTemplateService,private router: Router) {
        this.rfxSearchTemplates.pageSize = 10;
        this.rfxSearchTemplates.page = 1;
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
    //  EditTeam(row :any) {

    //     const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":row.id}});
    //     dialogRef.addPanelClass('inline-md-overlay');
    //     dialogRef.afterClosed().subscribe(result => {
    //       this.FetchBasicData();
    //     });

    // }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.rfxSearchTemplates.pageSize = event.pageSize;
        this.rfxSearchTemplates.page = page;
        this.FetchBasicData();
        //  this.dataSource=   this.CreatePaginationData(page,size);

    }
    rfqid:any;
    OnInputTypeChange(row)
    {
        this.rfqid=row.rfqid;
        
        
    }
    sortData(sort: Sort) {
        ////debugger;
        this.rfxSearchTemplates.direction = sort.direction;
        this.rfxSearchTemplates.column = sort.active;
        this.FetchBasicData();
    }

    rfxTempName:any="";
    rfxTempType:any="";
    
    FetchBasicData() {
       // //debugger;

        this.rfxTemplateService.getRFXTemplateList(this.rfxSearchTemplates).subscribe(result => {
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

    //   openDialog() {
    //     const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":"00000000-0000-0000-0000-000000000000"}});
    //     dialogRef.addPanelClass('inline-md-overlay');
    //     dialogRef.afterClosed().subscribe(result => {
    //       this.FetchBasicData();
    //     });
    // }
}

