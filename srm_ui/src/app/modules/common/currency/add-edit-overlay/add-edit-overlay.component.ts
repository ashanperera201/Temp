import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {MatPaginator,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CurrencyService} from 'app/shared/Services/etendering/currency.service';
import {CurrencyRateSearchModel} from 'app/main/Models/etendering/currency-rate-search-model';
import { Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';



@Component({
    selector: 'att-add-edit-overlay',
    templateUrl: './add-edit-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'currency', 'country','conversionFactor','rate'];
    currencySearchModel:CurrencyRateSearchModel=new CurrencyRateSearchModel();
    pageEvent: PageEvent;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });


    constructor(public dialogRef: MatDialogRef<AddEditOverlayComponent>,
                public dialog: MatDialog,private currencyService :CurrencyService) {
                    this.currencySearchModel.pageSize = 10;
                    this.currencySearchModel.page = 1;
                    this.currencySearchModel.isIMICurrency=false;
    }
    FetchBasicData() {
        ////debugger;
        
        this.currencyService.getCurrencyList(this.currencySearchModel).subscribe(result => {
            console.log(result);
            ////debugger;
            this.currencySearchModel=result;
            if(this.currencySearchModel)
            {
                if(this.currencySearchModel.currencyRates)
                {
                    for (var i = 0; i < this.currencySearchModel.currencyRates.length; i++) {
                        this.currencySearchModel.currencyRates[i].isBind=this.getIsImiCurrency(this.currencySearchModel.currencyRates[i]);
                    }
                }
            }
        });
    }
    ngOnInit() {
        this.FetchBasicData();

    }
    UpdateCurrencies() {
        for (var i = 0; i < this.currencySearchModel.currencyRates.length; i++) {
            this.currencySearchModel.currencyRates[i].isIMICurrency=this.currencySearchModel.currencyRates[i].isBind;
            }
       var isChecked= this.currencySearchModel.currencyRates.filter( x => x.isIMICurrency == true);
       if(isChecked)
       {
        if(isChecked.length==0)
        {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Please select atleast one currency to Add",
                showConfirmButton: false,
                timer: 1000
            });
            return;
        }
       }
      
        this.currencyService.UpdateCurrencies(this.currencySearchModel.currencyRates).subscribe(result => {
            console.log(result);
            this.dialogRef.close();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Currency('s) updated successfully",
                showConfirmButton: false,
                timer: 1000
            });
        });
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;

    }
public getIsImiCurrency(row)
{
   return row.isBind=(row.isIMICurrency && (row.isDeleted==false));
    // return (row.isIMICurrency && (row.isDeleted==false));
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
    sortData(sort: Sort) {
        ////debugger;
        this.currencySearchModel.direction = sort.direction;
        this.currencySearchModel.column = sort.active;
        this.FetchBasicData();
    }


}

