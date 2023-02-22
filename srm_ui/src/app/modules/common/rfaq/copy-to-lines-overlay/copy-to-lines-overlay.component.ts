import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { RFQSupplierCopyLinesFromHeaderModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-copy-lines-from-header-model';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';

@Component({
    selector: 'copy-to-lines-overlay',
    templateUrl: './copy-to-lines-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CopyToLinesOverlayComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    rfqId: any;
    supplierId: any;

    dataCopy: any;
    selectedAttachment: string;
    selectedCurrency: string;

    isLineChecked: any = 'one';
    specificLineNoTextBoxDisabled = true;
    specificLineNo: string;
    errorPromptSpecificLines: string = ', e.g. 1-5,8,11-13 (No space)';
    isNotValid = false;

    isHeaderInfoChecked: boolean;
    isAttachmentChecked: boolean;
    isCurrencyChecked: boolean;
    isLeadTimeChecked: boolean;
    isPromisedDateChecked: boolean;
    disableCopy: boolean = true;

    attachment: string;
    currency: string;
    leadTime: string;
    promisedDate: string;

    rfqSupplierCopyLinesFromHeaderModel: RFQSupplierCopyLinesFromHeaderModel = new RFQSupplierCopyLinesFromHeaderModel();

    message: string = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<CopyToLinesOverlayComponent>,
        public dialog: MatDialog,
        private rfaqService: RfaqService,
        private _fuseAlertService: FuseAlertService
    ) {
        this.dataCopy = data.context;
        this.rfqId = data.rfqId;
        this.supplierId = data.supplierId;
    }

    ngOnInit(): void {
        this.filterAttachmentNameById(this.dataCopy.rfqSupplierHeaderInformationAttatchmentModel[0].etMediaId);
        this.filterCurrencyNameById(this.dataCopy.rfqSupplierHeaderInformationModel.currencyId);

        //if select Qoute Valid Until
        // if (this.dataCopy.rfqSupplierHeaderInformationModel.qouteValideUntil) {
        //     this.dataCopy.rfqSupplierHeaderInformationModel.daysOrWeeksInt = "";
        //     this.dataCopy.rfqSupplierHeaderInformationModel.daysOrWeekType = "";
        // }
    }

    onLineChange(event): void {
        this.isLineChecked = event.value;
        this.specificLineNoTextBoxDisabled = !this.specificLineNoTextBoxDisabled;
    }

    filterAttachmentNameById(id: string): void {
        this.dataCopy.rfqSupplierHeaderInformationAttatchmentModel.forEach((item) => {
            if (item.etMediaId === id) {
                this.selectedAttachment = item.fileName;
                return;
            }
        });
    }

    filterCurrencyNameById(id: string): void {
        this.dataCopy.rfqCurrencies.forEach((item) => {
            if (item.currencyId === id) {
                this.selectedCurrency = item.currencyName;
                return;
            }
        });
    }

    filterLineAttachmentNameById(id: string): any {
        let name;
        this.dataCopy.rfqSupplierHeaderInformationAttatchmentModel.forEach((item) => {
            if (item.etMediaId === id) {
                name = item.fileName;
            }
        });
        return name;
    }

    filterLineCurrencyNameById(id: string): any {
        let name;
        this.dataCopy.currencies.forEach((item) => {
            if (item.currencyId === id) {
                name = item.currencyName;
            }
        });
        return name;
    }

    isAllHeaderInfoCheckBoxChecked(): void {
        this.isAttachmentChecked = this.isHeaderInfoChecked;
        this.isCurrencyChecked = this.isHeaderInfoChecked;
        this.isLeadTimeChecked = this.isHeaderInfoChecked;
        this.isPromisedDateChecked = this.isHeaderInfoChecked;
        this.disableCopy = !this.isHeaderInfoChecked;
    }

    onCheckChange(): void {
        if (this.isAttachmentChecked && this.isCurrencyChecked && this.isLeadTimeChecked && this.isPromisedDateChecked) {
            this.isHeaderInfoChecked = true;
            this.disableCopy = false;
        }
        else if (this.isAttachmentChecked || this.isCurrencyChecked || this.isLeadTimeChecked || this.isPromisedDateChecked) {
            this.isHeaderInfoChecked = false;
            this.disableCopy = false;
        }
        else {
            this.isHeaderInfoChecked = false;
            this.disableCopy = true;
        }
    }

    fetchCopyToLineFromHeaderInformation(): void {
        if (this.isLineChecked === 'one' || (this.isLineChecked === 'two' && this.specificLineNo)) {

            this.rfqSupplierCopyLinesFromHeaderModel.lineNumber = this.specificLineNo;
            this.rfqSupplierCopyLinesFromHeaderModel.isAttachmentChecked = this.isAttachmentChecked;
            this.rfqSupplierCopyLinesFromHeaderModel.isCurrencyChecked = this.isCurrencyChecked;
            this.rfqSupplierCopyLinesFromHeaderModel.isLeadtimeChecked = this.isLeadTimeChecked;
            this.rfqSupplierCopyLinesFromHeaderModel.isPromisedDateChecked = this.isPromisedDateChecked;
            this.isHeaderInfoChecked = this.isAttachmentChecked && this.isCurrencyChecked && this.isLeadTimeChecked && this.isPromisedDateChecked;
            this.isNotValid = false;

            this.rfqSupplierCopyLinesFromHeaderModel.rfqId = this.rfqId;
            this.rfqSupplierCopyLinesFromHeaderModel.supplierID = this.supplierId;

            this.rfaqService.saveCopyToLineFromHeaderInformation(this.rfqSupplierCopyLinesFromHeaderModel).subscribe((result) => {

                this.attachment = this.isAttachmentChecked || this.isHeaderInfoChecked ? this.filterLineAttachmentNameById(result.data.attachmentId) : null;

                this.currency = this.isCurrencyChecked || this.isHeaderInfoChecked ? this.filterLineCurrencyNameById(result.data.currencyId) : null;

                //check condition to omit default date time values
                this.leadTime = this.isLeadTimeChecked || this.isHeaderInfoChecked ? result.data.leadTime : null;
                this.promisedDate = this.isPromisedDateChecked || this.isHeaderInfoChecked ? result.data.promisedDate : null;

                if (result) {
                    this.message = 'Added';
                    this.show('successerror');
                    setTimeout(() => { this.dismiss('successerror'); }, 2000);
                }

                setTimeout(() => {
                    this.dialogRef.close();
                }, 2500);

                this.dataCopy.fetchRFQSupplierHeaderInformation();
            });
        }
        else {
            this.isNotValid = true;
        }
    }

    copyToLines(): void {
        this.isNotValid = false;
        if (this.isLineChecked === 'two' && this.specificLineNo) {
            if (/^[0-9\,\-]+$/.test(this.specificLineNo)) {
                const pages = this.specificLineNo.split(',');
                for (const p of pages) {
                    if (p.includes('-')) {
                        const range = p.split('-');
                        if (range.length !== 2 || range[0] === '' || range[1] === '' || isNaN(+range[0]) || isNaN(+range[1]) || range[0] > range[1]) {
                            this.isNotValid = true;
                            break;
                        }
                    }
                    else if (p === '' || isNaN(+p)) {
                        this.isNotValid = true;
                        break;
                    }
                }
            }
            else {
                this.isNotValid = true;
                return;
            }
        }

        if (this.isLineChecked === 'one') {
            this.dataCopy.rfqSupplierPartLineModelList.forEach((rfqSupplierPartline) => {
                this.copyData(rfqSupplierPartline);
            });
            this.dialogRef.close();
        }
        else if (!this.isNotValid && this.isLineChecked === 'two' && this.specificLineNo) {
            const pages = this.specificLineNo.split(',');
            pages.forEach((p) => {
                if (p.includes('-')) {
                    const range = p.split('-');
                    if (range.length === 2 && range[0] !== '' && range[1] !== '' && !isNaN(+range[0]) && !isNaN(+range[1])) {
                        for (let index = +range[0]; index <= +range[1]; index++) {
                            const pl = this.dataCopy.rfqSupplierPartLineModelList.filter(x => x.rfqPartLineModel.lineNumber === index.toString());
                            if (pl.length > 0) {
                                this.copyData(pl[0]);
                            }
                        }
                    }
                    else {
                        this.isNotValid = true;
                    }
                }
                else if (p !== '' && !isNaN(+p)) {
                    const pl = this.dataCopy.rfqSupplierPartLineModelList.filter(x => x.rfqPartLineModel.lineNumber === (+p).toString());
                    if (pl.length > 0) {
                        this.copyData(pl[0]);
                    }
                }
                else {
                    this.isNotValid = true;
                }
            });
            if (!this.isNotValid) {
                this.dialogRef.close();
            }
        }
        else {
            this.isNotValid = true;
        }
    }

    copyData(rfqSupplierPartline): void {
        if (this.isAttachmentChecked) {
            rfqSupplierPartline.attachmentId = this.dataCopy.rfqSupplierHeaderInformationAttatchmentModel[0].etMediaId;
            rfqSupplierPartline.fileName = this.dataCopy.rfqSupplierHeaderInformationAttatchmentModel[0].fileName;
        }
        if (this.isCurrencyChecked) {
            rfqSupplierPartline.currencyId = this.dataCopy.rfqSupplierHeaderInformationModel.currencyId;
        }
        if (this.isLeadTimeChecked) {
            if (this.dataCopy.rfqSupplierHeaderInformationModel.qouteValideUntil) {
                rfqSupplierPartline.leadTime = this.dataCopy.rfqSupplierHeaderInformationModel.qouteValideUntil;
            }
            else {
                rfqSupplierPartline.leadTime = this.dataCopy.rfqSupplierHeaderInformationModel.daysOrWeeksInt +
                    ' ' + this.dataCopy.rfqSupplierHeaderInformationModel.daysOrWeekType;
            }
        }
        if (this.isPromisedDateChecked) {
            rfqSupplierPartline.promisedDate = this.dataCopy.rfqSupplierHeaderInformationModel.deliveryTime;
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }

    dismiss(name: string): void {
        this._fuseAlertService.dismiss(name);
        this.message = '';
    }

    show(name: string): void {
        this._fuseAlertService.show(name);
    }
}
