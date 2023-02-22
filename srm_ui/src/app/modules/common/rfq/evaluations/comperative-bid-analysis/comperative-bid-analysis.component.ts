import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { ActivatedRoute } from '@angular/router';
import { analytics } from 'app/mock-api/dashboards/analytics/data';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatDialog } from '@angular/material/dialog';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
    colors: string[];
    states: ApexStates;
};

@Component({
    selector: 'app-comperative-bid-analysis',
    templateUrl: './comperative-bid-analysis.component.html',
    styleUrls: ['./comperative-bid-analysis.component.scss']
})

export class ComperativeBidAnalysisComponent implements OnInit {
    @Input() RFQID: any;
    detailsDisplayMap = new Map();


    constructor(public dialog: MatDialog,private activatedRoute: ActivatedRoute,private rfqPartLineService: RfqPartLineService, private rfqService: RfqService, private rfqSupplierService: RfqSupplierService) {
        activatedRoute.params.subscribe((params) => {
            this.RFQID = params['id'];
        });    
    }

    ngOnInit(): void {
        this.fetchRfqPartLineData();
        this.rfqSupplierService.getSubmittedResponseSupplier(this.RFQID,null).subscribe(result => {
            this.suppliers = result.data;
        });
    }

    suppliers: any = [];
    //   [
    //       {supplierName:"3Cloud.LLC",id:"FD4FBD8A-9CDF-4268-A0BB-900ADC3A51DB"}
    //       ,{supplierName:"99X Company",id:"B07B2482-6DDF-4621-83B4-61985D4CC4AE"}
    //       ,{supplierName:"3D INTERNATIONAL TECHNICAL SERVICES",id:"73A57930-99F2-4822-8BE3-6EB8D056C217"}
    //       ,{supplierName:"Abb Electrical Industries Co. Ltd",id:"EEA344CF-FE6F-46F2-9A98-74D80DC36521"}
    //       ,{supplierName:"Chicago Institute, Management Train",id:"FD4FBD8A-9CDF-4268-A0BB-900ADC3A51DB"}
    //       ,{supplierName:"A.T.Kearney Saudi Arabia Ltd.",id:"1094CAFC-F1EE-48C8-A856-FB76524C0658"}];
    partLineId: any = "";
    supplierId: any = undefined;
    isTechnical: any = false;
    isCommercial: any = false;
    isTechnicalCommercial: any = false;
    dynamicdata: any = [];
    generalData: any = [];
    evaluationData: any = [];
    partLines: any = [];

    partLineChange() {
        if (this.isTechnicalCommercial == true) {
            this.isCommercial = true;
            this.isTechnical = true;
        }
        else {
            this.isCommercial = false;
            this.isTechnical = false;
        }
        let cbaModel = { rfqId: null, supplierIDs: [], partLineIDs: [], isTechnical: this.isTechnical, isCommercial: this.isCommercial, isTechnicalCommercial: false };
        cbaModel.rfqId = this.RFQID;
        let supId: any;
        let plId: any;
        if (this.supplierId == 0 || this.supplierId == undefined || this.supplierId == null) {
            supId = null;
        }
        else {
            supId = this.supplierId;
        }
        if (this.partLineId == 0 || this.partLineId == undefined || this.partLineId == null) {
            plId = null;
        }
        else {
            plId = this.partLineId;
        }
        if (!supId) {
            for (var i = 0; i < this.suppliers.length; i++) {
                cbaModel.supplierIDs.push(this.suppliers[i].id);
            }
        }
        else {
            cbaModel.supplierIDs.push(this.supplierId);
        }
        if (!plId) {
            for (var i = 0; i < this.rfqPartLines.length; i++) {
                cbaModel.partLineIDs.push(this.rfqPartLines[i].id);
            }
        }
        else {
            cbaModel.partLineIDs.push(this.partLineId);
        }

        cbaModel.isTechnical = this.isTechnical;
        cbaModel.isCommercial = this.isCommercial;
        cbaModel.isTechnicalCommercial = this.isTechnicalCommercial;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
      
        this.rfqService.getCBA(cbaModel).subscribe(result => {
            refference.close();
            this.partLines = [];
            this.dynamicdata = [];
            this.dynamicdata = result.data;
            // this.suppliers=[];
            // this.suppliers=this.dynamicdata.rfqSuppliers;
            this.generalData = [];
            this.evaluationData = [];
            for (var i = 0; i < this.dynamicdata.partLinesData.length; i++) {
                let partLine = this.dynamicdata.partLinesData[i];
                partLine.generalData = [];
                partLine.scores = [];
                partLine.evaluationData = [];
                partLine.ranks = [];
                partLine.chartOptionsRanks;
                partLine.chartOptionsScores;
                for (var j = 0; j < this.dynamicdata.supplierData.length; j++) {
                    if (this.dynamicdata.partLinesData[i].id == this.dynamicdata.supplierData[j].rfqPartLineID) {
                        // partLine.supplierData.push(this.dynamicdata.supplierData[j]);
                        if (!((this.dynamicdata.supplierData[j].id == "Score") || (this.dynamicdata.supplierData[j].id == "Bid Acceptance") || (this.dynamicdata.supplierData[j].id == "Evaluator"))) {
                            partLine.generalData.push(this.dynamicdata.supplierData[j]);
                        }
                        if (((this.dynamicdata.supplierData[j].id == "Score") || (this.dynamicdata.supplierData[j].id == "Bid Acceptance") || (this.dynamicdata.supplierData[j].id == "Evaluator"))) {
                            partLine.evaluationData.push(this.dynamicdata.supplierData[j]);
                        }
                    }
                }
                this.getPartLineChart(partLine);
                this.partLines.push(partLine);

            }
            for (var i = 0; i < this.dynamicdata.supplierData.length; i++) {
                if (!((this.dynamicdata.supplierData[i].id == "Score") || (this.dynamicdata.supplierData[i].id == "Bid Acceptance") || (this.dynamicdata.supplierData[i].id == "Evaluator"))) {
                    this.generalData.push(this.dynamicdata.supplierData[i]);
                }
                if (((this.dynamicdata.supplierData[i].id == "Score") || (this.dynamicdata.supplierData[i].id == "Bid Acceptance") || (this.dynamicdata.supplierData[i].id == "Evaluator"))) {
                    this.evaluationData.push(this.dynamicdata.supplierData[i]);
                }
            }    
        });

    }

    getPartLineChart(rfqPartLine:any){

        let supplierNames = [];
        let supplierscores = [];
        let supplierranks = [];
            for (var i = 0; i < this.dynamicdata.suppliers.length; i++) {
                supplierNames.push(this.dynamicdata.suppliers[i].supplierName);
            }
            for (var i = 0; i < this.dynamicdata.scores.length; i++) {
                if(rfqPartLine.id==this.dynamicdata.scores[i].rfqPartLineId)
                {
                    supplierscores.push(this.dynamicdata.scores[i].supplierScore);
                }
                
            }
            let supplierNameRanks = [];
            for (var i = 0; i < this.dynamicdata.ranks.length; i++) {
                if(rfqPartLine.id==this.dynamicdata.ranks[i].rfqPartLineId)
                {
                    supplierranks.push(this.dynamicdata.ranks[i].supplierRank);
                    supplierNameRanks.push(this.dynamicdata.ranks[i].supplierName);
                }
                
            }
   
            rfqPartLine.chartOptionsRanks = {
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
                        name: 'Rank',
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
                        text: 'Rank'
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
    
            rfqPartLine.chartOptionsScores = {
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
                        name: 'Scores',
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
                        text: 'Scores'
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

            rfqPartLine.chartOptionsScores.series = [{ data: supplierscores }];

            rfqPartLine.chartOptionsScores.xaxis = { categories: supplierNames };

            rfqPartLine.chartOptionsRanks.series = [{ data: supplierranks }];

            rfqPartLine.chartOptionsRanks.xaxis = { categories: supplierNameRanks };

            return rfqPartLine;
    }
    // supplierNames: any = [];
    // supplierranks: any = [];
    // supplierscores: any = [];

    getData(dataObj, supName) {
        return dataObj[supName.supplierName.charAt(0).toLowerCase() + supName.supplierName.slice(1)];
    }

    rfqPartLines: any = [];
    fetchRfqPartLineData() {
        this.rfqPartLineService.getPartLineByPartLineRFQId(this.RFQID).subscribe(result => {
            this.rfqPartLines = result.data;
        });
    }

    isShow2 = true;

    toggleDisplay2() {
        this.isShow2 = !this.isShow2;
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

    @Output() indexUpdated = new EventEmitter<{ index: any }>();
    public gotoTab(index)
    {
        this.indexUpdated.emit({index:index});
    }
}