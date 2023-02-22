import { Component, DebugElement, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CurrencyService } from 'app/shared/Services/etendering/currency.service';
import { CurrencyRateViewModel } from 'app/main/Models/etendering/ViewModels/currency-rate-view-model';
import { RfqComponent } from '../rfq.component';
import { CurrencySearchModel } from 'app/main/Models/etendering/currency-search-model';
import { CurrencyRateSearchModel } from 'app/main/Models/etendering/currency-rate-search-model';
import { CurrencyViewModel } from 'app/main/Models/etendering/ViewModels/currency-view-model';
import { RFQCurrencyViewModel } from 'app/main/Models/etendering/ViewModels/rfq-currency-view-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-currency-overlay',
    templateUrl: './add-currency-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddCurrencyOverlayComponent {
    displayedColumns: string[] = ['id', 'currencycode', 'rate', 'conversionfactor'];
    dataSource: MatTableDataSource<CurrencyRateViewModel>;
    currency: string;
    rateDate: Date;
    rfqId: any;
    type: string = "";
    usedCurrencies: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public dialogRef: MatDialogRef<AddCurrencyOverlayComponent>,
        public dialog: MatDialog, private currencyService: CurrencyService, @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.rfqId = data.rfqId;
        this.type = data.type;
        this.usedCurrencies = data.usedCurrencies;
    }
    ngOnInit() {
        let currencyRateSearchModel = new CurrencyRateSearchModel();
        currencyRateSearchModel.currencyName = this.currency;
        currencyRateSearchModel.rateDate = this.rateDate;
        currencyRateSearchModel.rfxType=this.type;
        currencyRateSearchModel.page = 1;
        currencyRateSearchModel.pageSize = 1000;

        this.currencyService.getCurrencyRateList(currencyRateSearchModel).subscribe(result => {
            result.currencyRates = result.currencyRates.filter(val => !this.usedCurrencies.includes(val.currencyId));
            this.dataSource = new MatTableDataSource(result.currencyRates);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    doAction() {
        this.dialogRef.close();        
    }

    SearchData() {
        this.dataSource.filter = this.currency;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    saveTemplate() {
        let currencyRateViewModels: RFQCurrencyViewModel[] = [];

        for (var k = 0; k < this.dataSource.data.length; k++) {
            if (this.dataSource.data[k].isChecked == true) {
                let currencyRate: RFQCurrencyViewModel = new RFQCurrencyViewModel;
                currencyRate.currencyId =  this.dataSource.data[k].currencyId;
                currencyRate.currencyName =  this.dataSource.data[k].currencyName;
                currencyRate.conversionFactor =  this.dataSource.data[k].conversionFactor;
                currencyRate.rate =  this.dataSource.data[k].rate;
                currencyRate.currencyRateId =  this.dataSource.data[k].id;
                currencyRate.rFQId = this.rfqId;
                currencyRateViewModels.push(currencyRate);
            }
        }

        if (currencyRateViewModels.length > 0) {
            this.currencyService.SaveRFQCurrency(currencyRateViewModels).subscribe(result => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: "Currency('s) added successfully",
                    showConfirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                       
                            this.dialogRef.close();
                    }
                });
                
            });
            
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: "Please select Currency('s) to be added."
            }).then((result) => {
                if (result.isConfirmed) {
                   
                       
                }
            });
        }
        
    };
}
