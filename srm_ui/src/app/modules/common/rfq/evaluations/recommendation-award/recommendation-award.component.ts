import { Component, OnInit, Input, Output, EventEmitter, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AwardRecommendOverlayComponent } from '../../award-recommend-overlay/award-recommend-overlay.component';
import { AwardSelectedOverlayComponent } from '../../award-selected-overlay/award-selected-overlay.component';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ApprovalConfirmationOverlayComponent } from 'app/modules/common/rfq/approval-confirmation-overlay/approval-confirmation-overlay.component';
import { RejectionConfirmationOverlayComponent } from 'app/modules/common/rfq/rejection-confirmation-overlay/rejection-confirmation-overlay.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import { RFQApprovalViewModel } from 'app/main/Models/etendering/ViewModels/rfq-approval-model';
import Swal from 'sweetalert2';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { ChartOptions } from 'app/modules/common/rfq/evaluations/rfx-summary/rfx-summary.component';



@Component({
    selector: 'app-recommendation-award',
    templateUrl: './recommendation-award.component.html',
    styleUrls: ['./recommendation-award.component.scss']
})

export class RecommendationAwardComponent implements OnInit, OnDestroy {
    @Input() RFQID: any;
    @Input() RFQModel: any;
    detailsDisplayMap = new Map();
    public chartOptionsCBERanks: Partial<ChartOptions>;
    public chartOptionsTBERanks: Partial<ChartOptions>;
    public chartOptionsScores: Partial<ChartOptions>;

    destroy$ = new Subject<boolean>();
    processing: boolean = false;

    constructor(public dialog: MatDialog,private _changeDetectorRef:ChangeDetectorRef,
        private rfqService: RfqService,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService) {

            this.chartOptionsScores = {
                states: {
                    normal: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                    hover: {
                        filter: {
                            type: 'darken',
                            value: 0.2,
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                },
                series: [
                    {
                        name: 'Price',
                        data: []
                    },
                ],
                chart: {
                    height: 300,
                    type: 'bar',
                    toolbar: {
                        show: false
                    },
                    animations: {
                        enabled: false
                    }
                },
                fill: {
                    type: 'solid',
                    opacity: 1,
                    colors: [
                        '#0FA60C',
                        '#438AFE',
                        '#958F02',
                    ],
                },
    
                plotOptions: {
                    bar: {
                        columnWidth: '40%',
                        distributed: true,
                        dataLabels: {
                            position: 'top' // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + '';
                    },
                    offsetY: -20,
                    offsetX: 0,
                    style: {
                        fontSize: '12px',
                        colors: ['#464A53']
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    show: false
                },
                yaxis: {
                    title: {
                        text: 'All Lines Price'
                    }
                },
                xaxis: {
                    categories: [
                    ],
                    labels: {
                        style: {
                            colors: [
                                '#464A53',
                            ],
                            fontSize: '12px'
                        }
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + '';
                        }
                    }
                }
            };
    
            this.chartOptionsTBERanks = {
                states: {
                    normal: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                    hover: {
                        filter: {
                            type: 'darken',
                            value: 0.2,
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                },
                series: [
                    {
                        name: 'TBERank',
                        data: []
                    },
                ],
                chart: {
                    height: 300,
                    type: 'bar',
                    toolbar: {
                        show: false
                    },
                    animations: {
                        enabled: false
                    }
                },
                fill: {
                    type: 'solid',
                    opacity: 1,
                    colors: [
                        '#0FA60C',
                        '#438AFE',
                        '#958F02',
                    ],
                },
    
                plotOptions: {
                    bar: {
                        columnWidth: '40%',
                        distributed: true,
                        dataLabels: {
                            position: 'top' // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + '';
                    },
                    offsetY: -20,
                    offsetX: 0,
                    style: {
                        fontSize: '12px',
                        colors: ['#464A53']
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    show: false
                },
                yaxis: {
                    title: {
                        text: 'Average TBE Scores (Header + Lines)'
                    }
                },
                xaxis: {
                    categories: [
                    ],
                    labels: {
                        style: {
                            colors: [
                                '#464A53',
                            ],
                            fontSize: '12px'
                        }
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + '';
                        }
                    }
                }
            };
    
            this.chartOptionsCBERanks = {
                states: {
                    normal: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                    hover: {
                        filter: {
                            type: 'darken',
                            value: 0.2,
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                },
                series: [
                    {
                        name: 'CBERank',
                        data: []
                    },
                ],
                chart: {
                    height: 300,
                    type: 'bar',
                    toolbar: {
                        show: false
                    },
                    animations: {
                        enabled: false
                    }
                },
                fill: {
                    type: 'solid',
                    opacity: 1,
                    colors: [
                        '#0FA60C',
                        '#438AFE',
                        '#958F02',
                    ],
                },
    
                plotOptions: {
                    bar: {
                        columnWidth: '40%',
                        distributed: true,
                        dataLabels: {
                            position: 'top' // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + '';
                    },
                    offsetY: -20,
                    offsetX: 0,
                    style: {
                        fontSize: '12px',
                        colors: ['#464A53']
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    show: false
                },
                yaxis: {
                    title: {
                        text: 'Average CBE Scores (Header + Lines)'
                    }
                },
                xaxis: {
                    categories: [
                    ],
                    labels: {
                        style: {
                            colors: [
                                '#464A53',
                            ],
                            fontSize: '12px'
                        }
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + '';
                        }
                    }
                }
            };

    }

    getActiveDetailsTab(id: string): boolean {
        return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
    }

    toggleDisplay(id: string) {
        var existingVal = this.detailsDisplayMap.get(id);
        if (existingVal) {
            this.detailsDisplayMap.set(id, !existingVal)
        } else {
            this.detailsDisplayMap.set(id, true)
        }
    }

    partlines: any = [];
    isauto: any = false;
    supplierscores: any = [];
    supplierNames: any = [];
    supplierTBEranks: any = [];
    supplierCBEranks: any = [];
    supplierTBENames: any = [];
    supplierCBENames: any = [];
    ngOnInit(): void {
        let cbaModel = { rfqId: this.RFQID };
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
       
        this.rfqService.getROA(cbaModel).subscribe(result => {
            refference.close();
            this.approvalHistoryView.emit();
            this.dynamicdata = result.data;
            this.getRecommnedation();
            
        });
        this.RFQModel;
    }

    rankRecommendation: any;
    scoreRecommendation: any;

    getRecommnedation() {
        let rankRecommendation = this.dynamicdata.overallRecommendation.sort((a, b) => b.supplierRank - a.supplierRank);
        this.rankRecommendation = rankRecommendation[rankRecommendation.length - 1];
        let scoreRecommendation = this.dynamicdata.overallRecommendation.sort((a, b) => (b.tbe + b.cbe) - (a.tbe + a.cbe));
        this.scoreRecommendation = scoreRecommendation[0];
        let supplierRankBasedNames = [];
        let supplierPriceBasedNames = [];
        debugger;
        if (this.dynamicdata) {
            if (this.dynamicdata.overallRecommendation) {
                for (var k = 0; k < this.dynamicdata.overallRecommendation.length; k++) {
                    let avgSupRank = ((this.dynamicdata.overallRecommendation[k].supplierRank + this.dynamicdata.overallRecommendation[k].tbe + this.dynamicdata.overallRecommendation[k].cbe) / 3)
                    let priceBased = { "supplierName": this.dynamicdata.overallRecommendation[k].supplierName, "RankAvg": avgSupRank, "id": this.dynamicdata.overallRecommendation[k].id };
                    supplierPriceBasedNames.push({ "supplierName": this.dynamicdata.overallRecommendation[k].supplierName, "PriceRank": this.dynamicdata.overallRecommendation[k].supplierRank, "id": this.dynamicdata.overallRecommendation[k].id });
                    supplierRankBasedNames.push(priceBased);
                }
                if (supplierRankBasedNames) {
                    const closest = supplierRankBasedNames.reduce(
                        (acc, loc) =>
                            acc.PriceRank < loc.PriceRank
                                ? acc
                                : loc
                    )
                    this.scoreRecommendation = closest;
                }
                if (supplierPriceBasedNames) {
                    const closest1 = supplierPriceBasedNames.reduce(
                        (acc, loc) =>
                            acc.PriceRank < loc.RankAvg
                                ? acc
                                : loc
                    )
                    this.rankRecommendation = closest1;
                }
                if (this.rankRecommendation.supplierName == this.scoreRecommendation.supplierName) {
                    this.isSupplierSame = true;
                }
                if (this.dynamicdata != null) {
                    if (this.dynamicdata.partLines != null && this.dynamicdata.partLineResponses != null) {
                        for (var i = 0; i < this.dynamicdata.partLines.length; i++) {
                            let partLine: any;
                            partLine = this.dynamicdata.partLines[i];
                            partLine.supplierResponses = [];
                            for (var k = 0; k < this.dynamicdata.partLineResponses.length; k++) {
                                if (this.dynamicdata.partLines[i].id == this.dynamicdata.partLineResponses[k].rfqPartLineId) {
                                    partLine.supplierResponses.push(this.dynamicdata.partLineResponses[k]);
                                    if (this.dynamicdata.partLineResponses[k].isLineAwarded == true) {
                                        partLine.isLineAwarded = this.dynamicdata.partLineResponses[k].isLineAwarded;
                                    }
                                }
                            }
                            this.partlines.push(partLine);
                        }
                    }
                    
                }
                this.isauto = (this.dynamicdata.headerRow[0].isOverAllAwarded == null);
                this.supplierNames = [];
                this.supplierscores = [];
                this.supplierTBEranks = [];
                this.supplierCBEranks = [];
                this.supplierTBENames = [];
                this.supplierCBENames = [];
               
                for (var i = 0; i < this.dynamicdata.supplierRanks.length; i++) {
                    this.supplierNames.push(this.dynamicdata.supplierRanks[i].supplierName);
                    this.supplierscores.push(this.dynamicdata.supplierRanks[i].supplierRank);
                }
                for (var i = 0; i < this.dynamicdata.supplierTBEScores.length; i++) {
                    this.supplierTBEranks.push(this.dynamicdata.supplierTBEScores[i].tbe);
                    this.supplierTBENames.push(this.dynamicdata.supplierTBEScores[i].supplierName);
                }
                for (var i = 0; i < this.dynamicdata.supplierCBESCores.length; i++) {
                    this.supplierCBEranks.push(this.dynamicdata.supplierCBESCores[i].cbe);
                    this.supplierCBENames.push(this.dynamicdata.supplierCBESCores[i].supplierName);
                }
                // for (var i = 0; i < this.dynamicdata.supplierData.length; i++) {
                //     this.dynamicdata.supplierData[i].tbe=this.supplierTBEranks[i];
                //     this.dynamicdata.supplierData[i].cbe=this.supplierCBEranks[i];
                // }
                this.chartOptionsScores.series = [{ data: this.supplierscores }];

                this.chartOptionsScores.xaxis = { categories: this.supplierNames };

                this.chartOptionsTBERanks.series = [{ data: this.supplierTBEranks }];

                this.chartOptionsTBERanks.xaxis = { categories: this.supplierTBENames };
                this.chartOptionsCBERanks.series = [{ data: this.supplierCBEranks }];

                this.chartOptionsCBERanks.xaxis = { categories: this.supplierCBENames };
            }
        }
    }
    isSupplierSame = false;
    saveRecommendation(isall: boolean, rfqSupplierPartLineId: any) {
        let model: any;
        model.isAll = isall;
        if (isall == true) {
            rfqSupplierPartLineId = null;
        }
        model.rfqId = this.dynamicdata.headerRow[0].rfqId;
        model.supplierID = this.dynamicdata.headerRow[0].supplierID;
        model.rfqSupplierPartLineID = rfqSupplierPartLineId;
        model.recommendationOfAwardId = this.dynamicdata.headerRow[0].recommendationOfAwardId;

        this.rfqService.saveROA(model).subscribe(result => {
        });
    }

    dynamicdata: any;
    isShow2 = true;

    toggleDisplay2() {
        this.isShow2 = !this.isShow2;
    }

    openAwardSelectedLine(isall, rfqSupplierPartLineID, supplieriD, supplierName, suppliers) {
        let model: any = {};
        model.isAll = isall;
        model.rfqSupplierPartLineID = rfqSupplierPartLineID;
        model.recommendationOfAwardId = this.dynamicdata.headerRow[0].recommendationOfAwardId;
        model.rfqId = this.dynamicdata.headerRow[0].rfqId;
        model.supplierID = supplieriD;
        model.supplierName = supplierName;
        const ids = [supplieriD];
        if (suppliers != null) {
            model.suppliers = suppliers.filter(d => !ids.includes(d.supplierID));
        }
        else {
            model.suppliers = this.dynamicdata.supplierScoresRanks;
        }

        if (isall == true) {
            rfqSupplierPartLineID = null;
        }
        const dialogRef = this.dialog.open(AwardSelectedOverlayComponent, { data: { "roaModel": model } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {

            if (result.issuccess == true) {
                this.rfqUpdated.emit({ rfqModel: this.RFQModel });
                this.dynamicdata.headerRow[0].isOverAllAwarded = result.data.isOverAllAwarded;
                this.partlines = [];
                for (var i = 0; i < result.data.partLines.length; i++) {
                    let partLine: any;
                    partLine = result.data.partLines[i];
                    partLine.supplierResponses = [];
                    for (var k = 0; k < result.data.partLineResponses.length; k++) {
                        if (result.data.partLines[i].id == result.data.partLineResponses[k].rfqPartLineId) {
                            partLine.supplierResponses.push(result.data.partLineResponses[k]);
                            if (result.data.partLineResponses[k].isLineAwarded == true) {
                                partLine.isLineAwarded = result.data.partLineResponses[k].isLineAwarded;
                            }
                        }
                    }
                    this.partlines.push(partLine);
                }
            }
        });
    }

    openAwardRecommendLine(isall, rfqSupplierPartLineID) {
        let model: any = {};
        model.isAll = isall;
        if (isall == true) {
            rfqSupplierPartLineID = null;
        }
        model.rfqId = this.dynamicdata.headerRow[0].rfqId;
        model.supplierID = this.dynamicdata.headerRow[0].supplierID;
        model.rfqSupplierPartLineID = rfqSupplierPartLineID;
        model.recommendationOfAwardId = this.dynamicdata.headerRow[0].recommendationOfAwardId;

        // let rankRecommendation = this.dynamicdata.overallRecommendation.sort((a, b) => b.supplierRank - a.supplierRank);
        // this.rankRecommendation = rankRecommendation[rankRecommendation.length - 1];
        // let scoreRecommendation = this.dynamicdata.overallRecommendation.sort((a, b) => (b.tbe + b.cbe) - (a.tbe + a.cbe));
        // this.scoreRecommendation = scoreRecommendation[0];
        model.rankRecommendation = this.rankRecommendation;
        model.scoreRecommendation = this.scoreRecommendation;

        const dialogRef = this.dialog.open(AwardRecommendOverlayComponent, { data: { "roaModel": model } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-sm-overlay');
        dialogRef.afterClosed().subscribe(result => {
            if (result.issuccess == true) {
                this.rfqUpdated.emit({ rfqModel: this.RFQModel });
                this.dynamicdata.headerRow[0].isOverAllAwarded = result.data.isOverAllAwarded;
                this.partlines = [];
                for (var i = 0; i < result.data.partLines.length; i++) {
                    let partLine: any;
                    partLine = result.data.partLines[i];
                    partLine.supplierResponses = [];
                    for (var k = 0; k < result.data.partLineResponses.length; k++) {
                        if (result.data.partLines[i].id == result.data.partLineResponses[k].rfqPartLineId) {
                            partLine.supplierResponses.push(result.data.partLineResponses[k]);
                            if (result.data.partLineResponses[k].isLineAwarded == true) {
                                partLine.isLineAwarded = result.data.partLineResponses[k].isLineAwarded;
                            }
                        }
                    }
                    this.partlines.push(partLine);
                }
            }
        });
    }

    evaluationType: any = null;

    fetchEvaluationTypeData(event) {
        this.evaluationType == event.value;
        this.partLineChange();
    }

    // supplierscores: any = [];
    // supplierNames: any = [];
    supplierranks: any = [];
    isCommercial: any;
    isTechnical: any;
    isTechnicalCommercial: any;
    tbecbedata: any;

    partLineChange() {
        debugger;
        if (this.evaluationType == "Price") {
            this.isCommercial = true;
            this.isTechnical = true;
            this.isTechnicalCommercial = true;
        }
        else if (this.evaluationType == "TBE") {
            this.isCommercial = false;
            this.isTechnical = true;
            this.isTechnicalCommercial = false;
        }
        else if (this.evaluationType == "CBE") {
            this.isCommercial = true;
            this.isTechnical = false;
            this.isTechnicalCommercial = false;
        }
        // let cbaModel = { rfqId: null, supplierIDs: [], partLineIDs: [], isTechnical: this.isTechnical, isCommercial: this.isCommercial, isTechnicalCommercial: false };
        // cbaModel.rfqId = this.RFQID;
        // cbaModel.isTechnical = this.isTechnical;
        // cbaModel.isCommercial = this.isCommercial;
        // cbaModel.isTechnicalCommercial = this.isTechnicalCommercial;

        // this.rfqService.getCBA(cbaModel).subscribe(result => {
        //     this.tbecbedata = [];
        //     this.tbecbedata = result.data;

        //     this.supplierNames = [];
        //     this.supplierscores = [];
        //     this.supplierranks = [];
        //     for (var i = 0; i < this.tbecbedata.suppliers.length; i++) {
        //         this.supplierNames.push(this.tbecbedata.suppliers[i].supplierName);
        //     }
        //     for (var i = 0; i < this.tbecbedata.scores.length; i++) {
        //         this.supplierscores.push(this.tbecbedata.scores[i].supplierScore);
        //     }
        //     for (var i = 0; i < this.tbecbedata.ranks.length; i++) {
        //         this.supplierranks.push(this.tbecbedata.ranks[i].supplierRank);
        //     }

        //     this.chartOptionsScores.series = [{ data: this.supplierscores }];

        //     this.chartOptionsScores.xaxis = { categories: this.supplierNames };

        //     this.chartOptionsRanks.series = [{ data: this.supplierranks }];

        //     this.chartOptionsRanks.xaxis = { categories: this.supplierNames };
        // });

    }

    approvalConfirm() {
        const dialogRef = this.dialog.open(ApprovalConfirmationOverlayComponent, {
            height: 'auto',

            data: {
                id: "00000000-0000-0000-0000-000000000000",
                approver: 'Udaraa',
                activity: '123#456',
                rfqId: this.RFQID,
                approvalType: "ROA"
            },

            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
            this.RFQModel.isROAApproveReject=!result.issuccess;     
            this._changeDetectorRef.detectChanges();       
            if (result.issuccess == true) {
                this.rfqUpdated.emit({ rfqModel: this.RFQModel });
            }
        });
    }

    RFQSendForApproval = (): void => {
        this.processing = true;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'processing....' } });
        let rfqApprovalViewModel = new RFQApprovalViewModel();
        rfqApprovalViewModel.rFQId = this.RFQID;
        //rfqApprovalViewModel.approvalId = "332F6EBF-B605-4BA4-ACAA-02AC14F4C4D3";
        rfqApprovalViewModel.statusName = "Award Approval Pending";
        rfqApprovalViewModel.statusType = "ROA";
        rfqApprovalViewModel.approvalType = "ROA";

        this.rfqService.SendForApproval(rfqApprovalViewModel)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    refference.close();
                    const timeoutRef = setTimeout(() => {
                        clearTimeout(timeoutRef);
                        if (result.data.isSuccess == false) {
                            Swal.fire({
                                icon: 'error',
                                position: "center-start",
                                title: 'Error',
                                html: result.data.responseMessage,
                                customClass: {
                                    container: 'display-list'
                                },
                                target: '#error-alert'
                            });
                        }
                        else {

                            Swal.fire({
                                icon: 'success',
                                position: "center",
                                title: 'Success',
                                html: result.data.responseMessage
                            }).then((result) => {

                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    this.rfqUpdated.emit({ rfqModel: this.RFQModel });
                                }
                            });

                        }
                    }, 1000);
                },
                error: (error) => {
                    console.log(error);
                }
            })
    }
    @Output() rfqUpdated = new EventEmitter<{ rfqModel: RFQViewModel }>();
    @Output() approvalHistoryView = new EventEmitter<{ index: any }>();
    publishROA() {
        this.rfqService.publishROA({ "id": this.RFQID }).subscribe(result => {
            if (result.data.isSuccess == false) {

                Swal.fire({
                    icon: 'error',
                    position: "center-start",
                    title: 'Error',
                    html: result.data.responseMessage,
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                });
            }
            else {

                Swal.fire({
                    icon: 'success',
                    position: "center",
                    title: 'Success',
                    html: result.data.responseMessage
                }).then((result) => {

                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.rfqUpdated.emit({ rfqModel: this.RFQModel });
                    }
                });

            }
        });
    }

    rejectionConfirm() {
        const dialogRef = this.dialog.open(RejectionConfirmationOverlayComponent, {
            height: 'auto',

            data: {
                id: "00000000-0000-0000-0000-000000000000",
                approver: 'Udaraa',
                activity: '123#456',
                rfqId: this.RFQID,
                approvalType: "ROA"
            },

            disableClose: true

        });
        dialogRef.afterClosed().subscribe(result => {
            this.RFQModel.isROAApproveReject=!result.issuccess;
            this._changeDetectorRef.detectChanges();
            if (result.issuccess == true) {
                this.rfqUpdated.emit({ rfqModel: this.RFQModel });
            }
        });
    }

    dismiss(name: string): void {
        this._fuseAlertService.dismiss(name);
    }

    show(name: string): void {
        this._fuseAlertService.show(name);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}