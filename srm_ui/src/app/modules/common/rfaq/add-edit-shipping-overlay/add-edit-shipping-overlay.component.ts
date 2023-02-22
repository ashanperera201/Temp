/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQSupplierHeaderCountryOriginModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-country-origin-model';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { SurrogateResponseViewComponent } from '../../rfq/responses/surrogate-response-view/surrogate-response-view.component';

@Component({
    selector: 'add-edit-shipping-overlay',
    templateUrl: './add-edit-shipping-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditShippingOverlayComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    rfqSupplierHeaderInformationId: string;
    issuccess = false;
    iserror = false;

    frmShipping: FormGroup;
    dataShip: any;

    countryList: any = [];
    cityList: any = [];
    portList: any = [];
    incoTermList: any = [];
    incoTermCountryList: any = [];
    incoTermCityList: any = [];
    incoTermPortList: any = [];
    context: SurrogateResponseViewComponent;
    isSaving: boolean = false;

    countryFlag: string;
    incoTermCountryFlag: string;
    cityFlag: string;
    incoTermCityFlag: string;
    portFlag: string;
    incoTermFlag: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddEditShippingOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private rfaqService: RfaqService,
        private rfqService: RfqService
    ) {
        this.dataShip = data.id;
        this.context = data.context;
        this.rfqSupplierHeaderInformationId = this.context.rfqSupplierHeaderInformationModel.id;
        this.frmShipping = this.fb.group({
            'countryId': [this.dataShip ? this.dataShip.countryId : null],
            'cityId': [this.dataShip && this.cityList ? this.dataShip.cityId : null],
            'portId': [this.dataShip && this.portList ? this.dataShip.portId : null],
            'ifsIncoTermId': [this.dataShip ? this.dataShip.ifsIncoTermId : null],
            'incoTermCountryId': [this.dataShip ? this.dataShip.incoTermCountryId : null],
            'incoTermCityId': [this.dataShip && this.incoTermCityList ? this.dataShip.incoTermCityId : null],
            'incoTermPortId': [this.dataShip && this.incoTermPortList ? this.dataShip.incoTermPortId : null],
            'rfqSupplierHeaderInformationId': [this.rfqSupplierHeaderInformationId]
        });
    }

    ngOnInit(): void {
        this.fetchCountryData();
        // this.fetchIncoTermCountryData();
        this.fetchIFSIncoTermData();

        if (this.dataShip) {
            this.getCities(this.dataShip.countryId, this.dataShip.cityId);
            this.getPorts(this.dataShip.cityId, this.dataShip.portId);
            this.countryFlag = this.dataShip.countryName;
            this.cityFlag = this.dataShip.cityName;
            this.portFlag = this.dataShip.portName;
            this.incoTermFlag = this.dataShip.ifsIncoTermName;
            // this.getIncoTermCities(this.dataShip.incoTermCountryId, this.dataShip.incoTermCityId);
            // this.getIncoTermPorts(this.dataShip.incoTermCityId, this.dataShip.incoTermPortId);
        }
    }

    doAction(): void {
        this.dialogRef.close();
    }

    fetchCountryData(): void {
        this.rfaqService.getCountry().subscribe((result) => {
            this.countryList = result.data;
        });
    }

    fetchIncoTermCountryData(): void {
        this.rfaqService.getCountry().subscribe((result) => {
            this.incoTermCountryList = result.data;
        });
    }

    setCountryFlag(countryId): void {
        for (let i = 0; i < this.countryList.length; i++) {
            if (this.countryList[i].id === countryId) {
                this.countryFlag = this.countryList[i].description;
            }
        }
    }

    setIncoTermCountryFlag(countryId): void {
        for (let i = 0; i < this.incoTermCountryList.length; i++) {
            if (this.incoTermCountryList[i].id === countryId) {
                this.incoTermCountryFlag = this.incoTermCountryList[i].description;
            }
        }
    }

    setCityFlag(cityId): void {
        for (let i = 0; i < this.cityList.length; i++) {
            if (this.cityList[i].id === cityId) {
                this.cityFlag = this.cityList[i].text;
            }
        }
    }

    setIncoTermCityFlag(cityId): void {
        for (let i = 0; i < this.incoTermCityList.length; i++) {
            if (this.incoTermCityList[i].id === cityId) {
                this.incoTermCityFlag = this.incoTermCityList[i].text;
            }
        }
    }

    setPortFlag(portId): void {
        for (let i = 0; i < this.portList.length; i++) {
            if (this.portList[i].id === portId) {
                this.portFlag = this.portList[i].text;
            }
        }
    }

    setIncoTermFlag(incoTermId): void {
        for (let i = 0; i < this.incoTermList.length; i++) {
            if (this.incoTermList[i].id === incoTermId) {
                this.incoTermFlag = this.incoTermList[i].description;
            }
        }
    }

    getCities(countryId, cityId): void {
        this.setCountryFlag(countryId);
        this.frmShipping.get('cityId').setValue(cityId);
        this.rfqService.getCities(countryId).subscribe((result) => {
            this.cityList = result;
        });
        if (cityId == null) {
            this.frmShipping.get('portId').setValue(null);
            this.portList = [];
            this.cityFlag = '';
            this.portFlag = '';
        }
    }

    getIncoTermCities(countryId, cityId): void {
        this.setIncoTermCountryFlag(countryId);
        this.frmShipping.get('incoTermCityId').setValue(cityId);
        this.rfqService.getCities(countryId).subscribe((result) => {
            this.incoTermCityList = result;
        });
        if (cityId == null) {
            this.frmShipping.get('incoTermPortId').setValue(null);
            this.incoTermPortList = [];
        }
    }

    getPorts(cityId, portId): void {
        this.setCityFlag(cityId);
        this.frmShipping.get('portId').setValue(portId);
        this.rfqService.getPorts(cityId).subscribe((result) => {
            this.portList = result;
        });
        if (portId == null) {
            this.portFlag = '';
        }
    }

    getIncoTermPorts(cityId, portId): void {
        this.setIncoTermCityFlag(cityId);
        this.frmShipping.get('incoTermPortId').setValue(portId);
        this.rfqService.getPorts(cityId).subscribe((result) => {
            this.incoTermPortList = result;
        });
    }

    fetchIFSIncoTermData(): void {
        this.rfaqService.getIFSIncoTerm().subscribe((result) => {
            this.incoTermList = result.data;
        });
    }

    onFormSubmit(form: NgForm): void {

        this.isSaving = true;
        let countryOrigin: RFQSupplierHeaderCountryOriginModel = new RFQSupplierHeaderCountryOriginModel();
        countryOrigin = Object.assign(countryOrigin, form);

        countryOrigin.id = this.dataShip ? this.dataShip.id : '00000000-0000-0000-0000-000000000000';
        countryOrigin.countryId = this.frmShipping.get('countryId').value;
        countryOrigin.cityId = this.frmShipping.get('cityId').value;
        countryOrigin.portId = this.frmShipping.get('portId').value;
        countryOrigin.ifsIncoTermId = this.frmShipping.get('ifsIncoTermId').value;
        countryOrigin.incoTermCountryId = this.frmShipping.get('incoTermCountryId').value;
        countryOrigin.incoTermCityId = this.frmShipping.get('incoTermCityId').value;
        countryOrigin.incoTermPortId = this.frmShipping.get('incoTermPortId').value;
        countryOrigin.rfqSupplierHeaderInformationId = this.rfqSupplierHeaderInformationId;
        this.rfaqService.saveRFQSupplierHeaderCountryOrigin([countryOrigin]).subscribe((result) => {
            this.dialogRef.close();
            this.isSaving = false;

            countryOrigin.countryName = this.countryFlag;
            countryOrigin.cityName = this.cityFlag;
            countryOrigin.portName = this.portFlag;
            countryOrigin.ifsIncoTermName = this.incoTermFlag;

            if (countryOrigin.id === '00000000-0000-0000-0000-000000000000') {
                countryOrigin.id = result.data[0].id;
                this.context.rfqSupplierHeaderCountryOriginModel.push(countryOrigin);

                this.context.message = 'Added';
                this.context.show('successerror');
                setTimeout(() => { this.context.dismiss('successerror'); }, 3000);
            }
            else {
                const data = this.context.rfqSupplierHeaderCountryOriginModel.filter(x => x.id === this.dataShip.id);
                const index = this.context.rfqSupplierHeaderCountryOriginModel.indexOf(data[0]);
                this.context.rfqSupplierHeaderCountryOriginModel[index] = countryOrigin;
                this.context.message = 'Updated';
                this.context.show('successerror');
                setTimeout(() => { this.context.dismiss('successerror'); }, 3000);
            }
        });
    }
}
