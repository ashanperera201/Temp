import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { DataService } from '../supplier-review-data.service';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { ReviewOutcome, Tabs } from '../supplier-review-models';
import { Location } from '@angular/common';

@Component({
    selector: 'app-review-summary-charts',
    templateUrl: './review-summary-charts.component.html',
    styleUrls: ['./review-summary-charts.component.scss'],
})
export class ReviewSummaryChartsComponent implements OnInit {
    outcomes: ReviewOutcome[];
    reviewOutcomeCompletedState =
        SupplierReviewConstants.reviewOutcomeCompletedState;
    CHART_WIDTH = 600;
    showChart1 = true;
    showChart3 = true;
    materialTypeForm = SupplierReviewConstants.materialTypeForm;
    serviceTypeForm = SupplierReviewConstants.serviceTypeForm;
    commonTypeForm = SupplierReviewConstants.commonTypeForm;

    constructor(public dataService: DataService,  public _location: Location) {
        this.outcomes = this.dataService.outcomes;
    }

    ngOnInit() {
        this.displayScorePieChart();
        this.displaySupplierTypeBarChart();
        this.displayThresholdPieChart();
        this.displayReviewYearBarChart();
    }

    displayScorePieChart() {
        var emptyChart = [0, 0, 0, 0];
        var scoreBreakdown = [0, 0, 0, 0];
        this.outcomes.forEach((outcome) => {
            if (outcome.status == this.reviewOutcomeCompletedState) {
                if (outcome.finalScore < 40) {
                    scoreBreakdown[0] += 1;
                } else if (outcome.finalScore < 60) {
                    scoreBreakdown[1] += 1;
                } else if (outcome.finalScore < 80) {
                    scoreBreakdown[2] += 1;
                } else {
                    scoreBreakdown[3] += 1;
                }
            }
        });

        var options = {
            series: scoreBreakdown,
            chart: {
                width: this.CHART_WIDTH,
                type: 'donut',
            },
            fill: {
                opacity: 1,
                type: "gradient",
                colors: ['#0a417a', '#8464a0','#cea9bc','#323232'],
            },
            labels: ['Below 40', '40 - 60', '60 - 80', 'Above 80'],
            colors: ['#0a417a', '#8464a0','#cea9bc','#323232'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };
        console.log("scoreBreakdown", scoreBreakdown, emptyChart, scoreBreakdown == emptyChart)
       
        console.log("showChart1", this.showChart1)
        var chart = new ApexCharts(
            document.querySelector('#chart1'),
            options
        );
        console.log("chart elemts", chart)
        chart.render();
        
    }

    displaySupplierTypeBarChart() {
        var supplierTypeStats = [0, 0, 0];
        this.outcomes.forEach((outcome) => {
            if (outcome.services == this.materialTypeForm) {
                supplierTypeStats[0] += 1;
            } else if (outcome.services == this.serviceTypeForm) {
                supplierTypeStats[1] += 1;
            } else {
                supplierTypeStats[2] += 1;
            }
        });

        var options = {
            chart: {
                width: this.CHART_WIDTH,
                type: 'bar',
            },
            series: [
                {
                    name: 'Supplier Type',
                    data: supplierTypeStats,
                },
            ],
            xaxis: {
                categories: [this.materialTypeForm, this.serviceTypeForm, this.commonTypeForm],
            },
            fill: {
                type: 'solid',
                opacity: 1,
                colors: ['#0a417a', '#8464a0','#cea9bc','#323232'],
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        var chart = new ApexCharts(document.querySelector('#chart2'), options);

        chart.render();
    }

    displayThresholdPieChart() {
        var emptyChart = [0, 0];
        var thresholdBreakdown =  [0,0];;
        this.outcomes.forEach((outcome) => {
            if (outcome.status == this.reviewOutcomeCompletedState) {
                if (outcome.finalScore < 50) {
                    thresholdBreakdown[0] += 1;
                } else {
                    thresholdBreakdown[1] += 1;
                }
            }
        });

        var options = {
            series: thresholdBreakdown,
            chart: {
                width: this.CHART_WIDTH,
                type: 'donut',
            },
            fill: {
                type: 'gradient',
                opacity: 1,
                colors: ['#0a417a', '#8464a0'],
            },
            labels: ['Below threshold', 'Above threshold'],
            colors: ['#0a417a', '#8464a0'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        var chart = new ApexCharts(
        document.querySelector('#chart3'),
        options
    );
        chart.render(); 
    }

    displayReviewYearBarChart() {
        var reviewYearStats = { '2018': 0 };
        var first = 2018;
        this.outcomes.forEach((outcome) => {
            while (parseInt(outcome.reviewYear) > first) {
                first += 1;
                reviewYearStats[first.toString()] = 0;
            }
            if (outcome.reviewYear in reviewYearStats) {
                reviewYearStats[outcome.reviewYear] += 1;
            } else {
                reviewYearStats[outcome.reviewYear] = 1;
            }
        });

        var reviewYearValues = Object.keys(reviewYearStats).map(function (key) {
            return reviewYearStats[key];
        });

        var options = {
            chart: {
                width: this.CHART_WIDTH,
                type: 'bar',
            },
            series: [
                {
                    name: 'Review Year',
                    data: reviewYearValues,
                },
            ],
            xaxis: {
                categories: Object.keys(reviewYearStats),
            },
            fill: {
                type: 'solid',
                opacity: 1,
                colors: ['#0a417a', '#8464a0','#cea9bc','#323232'],
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        var chart = new ApexCharts(document.querySelector('#chart4'), options);

        chart.render();
    }

    exportToPDF() {
        const dashboard: any = document.getElementById('charts');
        const options = { background: 'white' };

        domtoimage.toPng(dashboard, options).then((imgData: any) => {
                const doc = new jsPDF('l', 'mm',);
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                doc.save('Chart.pdf');
            });
    }

    goBack(){
        this.dataService.landingTab = Tabs.Review_Outcomes;
        this._location.back()
    }
}
