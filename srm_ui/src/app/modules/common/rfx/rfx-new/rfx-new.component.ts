import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NegotiationStyleService } from 'app/shared/Services/etendering/negotiation-style.service';
import { NegotiationStyleSearchModel } from 'app/main/Models/etendering/negotiation-style-search-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';

import { state } from '@angular/animations';
import { RFXTemplateSearchModel } from 'app/main/Models/etendering/rfx-template-search-model';
import {CurrencyRateSearchModel} from 'app/main/Models/etendering/currency-rate-search-model';

export interface RowData {
    id: string;
    number: string;
    revision: string;
    type: string;
    name: string;
    created: string;
    startDate: string;
    endDate: string;
    status: string;
}

/** Constants used to fill up our data base. */
const NUMBER: string[] = [
    '1231', '1232', '1233', '1234', '1235', '1236',
];
const REVISION: string[] = [
    '00', '01', '11', '00', '01', '10',
];
const TYPE: string[] = [
    'RFI', 'RFAQ', 'RFI', 'RFAQ', 'RFI', 'RFAQ',
];
const NAME: string[] = [
    'Office Supplies for 3rd floor', 'Port Dubai warehouse  01', 'Port Dubai warehouse  02', 'Port Dubai warehouse  03', 'Port Dubai warehouse  04', 'Port Dubai warehouse  05',
];
const CREATED: string[] = [
    'Andy Robert', 'Jason Mac', 'Jacob Gray', 'Chris Potter', 'Mohammed Kafil', 'Jason Potter',
];
const STARTDATE: string[] = [
    '21-Jan-2020', '20-Jan-2020', '22-Jan-2020', '24-Jan-2020', '22-Jan-2020', '21-Jan-2020',
];
const ENDDATE: string[] = [
    '21-Jan-2021', '21-Jan-2021', '21-Jan-2021', '21-Jan-2021', '21-Jan-20210', '21-Jan-2021',
];
const STATUS: string[] = [
    'Awarded', 'Awarded', 'Revised', 'Revised', 'Awarded', 'Revised',
];


@Component({
    selector: 'rfx',
    templateUrl: './rfx-new.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RfxNewComponent {
    displayedColumns: string[] = ['id', 'number', 'revision', 'type', 'name', 'created', 'startDate', 'endDate', 'status'];
    dataSource: MatTableDataSource<RowData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;

    selectedName: '';
    selectedDescription: '';
    selectedType: '';
    selectedNegotiation: '';
    selectedBidding: '';
    selectedCurrency: '';
    
    negotiationStyleSearchModel: NegotiationStyleSearchModel = new NegotiationStyleSearchModel();
    currencySearchModel: CurrencyRateSearchModel=new CurrencyRateSearchModel();
    /**
     * Constructor
     */
    constructor(private rfqService:RfqService,public dialog: MatDialog, private negotiationStyleService: NegotiationStyleService, private router: Router) {
        const users = Array.from({ length: 100 }, (_, k) => createNewRow(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    OpenURL(url) {
        // this.router.navigate([url]);
        this.router.navigateByUrl(url, { state: { hello: 'world' } });
    }

    OpenNextStepURL(url) {
        this.router.navigateByUrl(url, { state: { name: this.selectedName, description: this.selectedDescription, type: this.selectedType, negotiation: this.selectedNegotiation, biding: this.selectedBidding, currency: this.selectedCurrency } });       
    }

    fetchNegotiationStyleData(): void {
        this.negotiationStyleService.getNegotiationStyleList(this.negotiationStyleSearchModel).subscribe((result) => {
            this.negotiationStyleSearchModel = result;
        });
    }
currencies:any=[];
    fetchCurrencyData(): void {
        this.rfqService.getCurrencyListWithDefaults(this.selectedType).subscribe((result) => {
            this.currencies = result.data;
            this.selectedCurrency=result.defultCurrencyId;
        });
    }

    ngOnInit() {
        this.fetchNegotiationStyleData();
    }
}
/** Builds and returns a new createNewRow. */
function createNewRow(id: number): RowData {

    return {
        id: id.toString(),
        number: NUMBER[Math.round(Math.random() * (NUMBER.length - 1))],
        revision: REVISION[Math.round(Math.random() * (REVISION.length - 1))],
        type: TYPE[Math.round(Math.random() * (TYPE.length - 1))],
        name: NAME[Math.round(Math.random() * (NAME.length - 1))],
        created: CREATED[Math.round(Math.random() * (CREATED.length - 1))],
        startDate: STARTDATE[Math.round(Math.random() * (STARTDATE.length - 1))],
        endDate: ENDDATE[Math.round(Math.random() * (ENDDATE.length - 1))],
        status: STATUS[Math.round(Math.random() * (STATUS.length - 1))],
    };
}

