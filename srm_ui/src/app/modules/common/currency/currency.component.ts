import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AddEditOverlayComponent} from './add-edit-overlay/add-edit-overlay.component';
import {CurrencyService} from 'app/shared/Services/etendering/currency.service';
import {CurrencyRateSearchModel} from 'app/main/Models/etendering/currency-rate-search-model';
import { CurrencyViewModel } from 'app/main/Models/etendering/ViewModels/currency-view-model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import Swal from 'sweetalert2';



@Component({
    selector     : 'attribute-items',
    templateUrl  : './currency.component.html',
    styleUrls:['./currency.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CurrencyComponent
{
    pageEvent: PageEvent;
    displayedColumns: string[] = ['id', 'currencyCode', 'rate', 'validFrom', 'conversion', 'rfq', 'rfi', 'rfaq','activedeactive'];
    currencySearchModel:CurrencyRateSearchModel=new CurrencyRateSearchModel();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    panelOpenState = false;
    defaultGuid:string="";
    /**
     * Constructor
     */
    constructor(public dialog: MatDialog,private currencyService :CurrencyService, private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService)
    {
        this.currencySearchModel.baseCurrency="";
        this.currencySearchModel.IsIMICurrency = true;
        // this.currencySearchModel.isIMICurrency=true;
    }
    FetchBasicData() {
        //debugger;
        // this.currencySearchModel.page=1;
        // this.currencySearchModel.pageSize=1000;
        this.currencyService.getCurrencyList(this.currencySearchModel).subscribe(result => {
            console.log(result);
            ////debugger;
            this.currencySearchModel=result;
        //    this.currencies = Array.from(new Set(this.currencySearchModel.currencyRates.map(x => {x.currencyId,x.currencyName})));

           

        });
    }
    // currencies=[];
    ngOnInit() {
        this.FetchBasicData();

    }
    SaveDefaults() {
        debugger;
        this.currencyService.SaveCurrencyRates(this.currencySearchModel).subscribe(result => {
            console.log(result);
            ////debugger;
            this.currencySearchModel=result;
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Information updated successfully",
                showConfirmButton: false,
                timer: 1000
            });
           
        });

    }
    
    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent);
        dialogRef.disableClose=true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.FetchBasicData();
        });
    }

    DeleteCR(model: CurrencyViewModel[]) {
        Swal.fire({
            title: 'Inactivate Currency',
            text: "Are you sure you want to inactivate this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Inactivate'
        }).then((result) => {
            if (result.isConfirmed) {
                this.currencyService.DeleteCurrenacyRate([model]).subscribe(result => {
                    this.FetchBasicData();
                    Swal.fire(
                        'Inactivate!',
                        'Record inactivated successfully.',
                        'success'
                    )
                    });
              
            }
        });
    }

    ActivateCR(model: CurrencyViewModel[]) {
        Swal.fire({
            title: 'Activate Currency',
            text: "Are you sure you want to activate this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Activate'
        }).then((result) => {
            if (result.isConfirmed) {
                this.currencyService.ActivateCurrenacyRate([model]).subscribe(result => {
                    this.FetchBasicData();
                    Swal.fire(
                        'Activate!',
                        'Record activated successfully.',
                        'success'
                    )
                    });
              
            }
        });
    }
    
    
    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.currencySearchModel.pageSize = event.pageSize;
        this.currencySearchModel.page = page;
        this.FetchBasicData();
        //  this.dataSource=   this.CreatePaginationData(page,size);

    }
}

