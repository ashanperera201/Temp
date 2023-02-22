import { Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';
import { RowData22 } from '../../rfq.component';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ActivatedRoute } from '@angular/router';
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
    selector: 'app-rfx-summary',
    templateUrl: './rfx-summary.component.html',
    styleUrls: ['./rfx-summary.component.scss']
})

export class RfxSummaryComponent implements OnInit {

    @Input() dataSource22: MatTableDataSource<RowData22>;
    @Input() displayedColumn22: string[];
    @Input() RFQID;
    public chartOptionsCBERanks: Partial<ChartOptions>;
    public chartOptionsTBERanks: Partial<ChartOptions>;
    public chartOptionsScores: Partial<ChartOptions>;

    constructor(public dialog: MatDialog,private activatedRoute: ActivatedRoute,private rfqService: RfqService) {
        activatedRoute.params.subscribe((params) => {
            this.RFQID = params['id'];
        });
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

    partlines: any = [];
    dynamicdata: any;
    supplierscores: any = [];
    supplierNames: any = [];
    supplierTBEranks: any = [];
    supplierCBEranks: any = [];
    supplierTBENames: any = [];
    supplierCBENames: any = [];
    ngOnInit(): void {
        let cbaModel = { rfqId: this.RFQID };
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
      
        this.rfqService.getSummary(cbaModel).subscribe(result => {
            refference.close();
            this.dynamicdata = result.data;
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
            this.chartOptionsScores.series = [{ data: this.supplierscores }];

            this.chartOptionsScores.xaxis = { categories: this.supplierNames };

            this.chartOptionsTBERanks.series = [{ data: this.supplierTBEranks }];

            this.chartOptionsTBERanks.xaxis = { categories: this.supplierTBENames };
            this.chartOptionsCBERanks.series = [{ data: this.supplierCBEranks }];

            this.chartOptionsCBERanks.xaxis = { categories: this.supplierCBENames };

            for (var i = 0; i < this.dynamicdata.supplierData.length; i++) {
                this.dynamicdata.supplierData[i].tbe=this.supplierTBEranks[i];
                this.dynamicdata.supplierData[i].cbe=this.supplierCBEranks[i];
            }
            

        });
    }

    isShow2 = true;

    toggleDisplay2() {
        this.isShow2 = !this.isShow2;
    }
    @Output() indexUpdated = new EventEmitter<{ index: any }>();
    public gotoROA()
    {
        this.indexUpdated.emit({index:4});
    }

}
