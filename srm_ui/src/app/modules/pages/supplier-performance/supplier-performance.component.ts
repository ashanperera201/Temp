import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexStroke,
  ApexStates,
  ApexAxisChartSeries, ApexYAxis, ApexXAxis, ApexTooltip, ApexLegend, ApexGrid, ApexResponsive, ApexTitleSubtitle
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Supplier } from 'app/main/Models/Supplier';
import { SupplierReviewConstants } from '../supplier-reviews/supplier-review-constants';
import { ReviewOutcome } from '../supplier-reviews/supplier-review-models';

export interface RowData13 {
  evalName: string;
  supName: string;
  reviewTime: string;
  reqBy: string;
  status: string;
  initDate: string;
  pubDate: string;
  revYear: string;
}
export type ChartOptions7 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  title: ApexTitleSubtitle;
  labels: any;
};
export type ChartOptions6 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  title: ApexTitleSubtitle;
  labels: any;
};
export type ChartOptions5 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  title: ApexTitleSubtitle;
  labels: any;
};
export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  title: ApexTitleSubtitle;
  labels: any;
};
export type ChartOptions4 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  title: ApexTitleSubtitle;
  labels: any;
};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  states: ApexStates;
};
export type ChartOptions22 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  states: ApexStates;
};
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
export type ChartOptions8 = {
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
  selector: 'app-supplier-performance',
  templateUrl: './supplier-performance.component.html',
  styleUrls: ['./supplier-performance.component.scss']
})

export class SupplierPerformanceComponent {
  displayedColumn13: string[] = ['id', 'evalName', 'supName', 'reviewTime', 'reqBy', 'status', 'initDate', 'pubDate', 'revYear'];
  displayedColumns13: string[] = ['evalName', 'timePeriod', 'outcome'];

  dataSource13: MatTableDataSource<RowData13>;
  public chartOptions8: Partial<ChartOptions8>;
  public chartOptions7: Partial<ChartOptions7>;
  public chartOptions6: Partial<ChartOptions6>;
  public chartOptions5: Partial<ChartOptions5>;
  public chartOptions4: Partial<ChartOptions4>;
  public chartOptions3: Partial<ChartOptions3>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions22: Partial<ChartOptions22>;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() supplierId: number;

  supplier: Supplier;
  supplierName: string;
  supplierStatus: string;
  outcomes: MatTableDataSource<ReviewOutcome>;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod
  customTypePeriod = SupplierReviewConstants.customTypePeriod
  panelOpenState = false;
  /**
   * Constructor
   */
  constructor(public dialog: MatDialog, private http: HttpClient) {
    this.chartOptions8 = {
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
          name: 'No of Deliveries',
          data: [230, 420, 610, 755]
        },
      ],
      chart: {
        height: 200,
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
          '#7BCB0A',
          '#1AAFD0',
          '#4E36E2',
          '#0192FF',
        ],
      },

      plotOptions: {
        bar: {
          columnWidth: '70%',
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
          text: 'No of Orders'
        }
      },
      xaxis: {
        categories: [
          ['5<'],
          ['5-10'],
          ['11-30'],
          ['30+'],

        ],
        title: {
          text: '% of Returns'
        },
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
    this.chartOptions7 = {
      series: [820, 80],
      chart: {
        type: 'donut'
      },
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
      fill: {
        type: 'solid',
        opacity: 1,
        colors: [
          '#7BCB0A',
          '#4E36E2',
        ],
      },
      labels: ['On Time', 'Delayed'],
      plotOptions: {
        pie: {
          donut: {
            size: '55%'
          }
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          color: '#616161'
        },
        align: 'center'
      },
      tooltip: {
        fillSeriesColor: false,
        shared: false,
        marker: {
          show: false,
        },
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      }
    };
    this.chartOptions6 = {
      series: [820, 80],
      chart: {
        type: 'donut'
      },
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
      fill: {
        type: 'solid',
        opacity: 1,
        colors: [
          '#1AAFD0',
          '#4E36E2',
        ],
      },
      labels: ['On Time', 'Delayed'],
      plotOptions: {
        pie: {
          donut: {
            size: '55%'
          }
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          color: '#616161'
        },
        align: 'center'
      },
      tooltip: {
        fillSeriesColor: false,
        shared: false,
        marker: {
          show: false,
        },
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      }
    };
    this.chartOptions5 = {
      series: [820, 80],
      chart: {
        type: 'donut'
      },
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
      fill: {
        type: 'solid',
        opacity: 1,
        colors: [
          '#7BCB0A',
          '#4E36E2',
        ],
      },
      labels: ['On Time', 'Delayed'],
      plotOptions: {
        pie: {
          donut: {
            size: '55%'
          }
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          color: '#616161'
        },
        align: 'center'
      },
      tooltip: {
        fillSeriesColor: false,
        shared: false,
        marker: {
          show: false,
        },
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      }
    };
    this.chartOptions4 = {
      series: [820, 80],
      chart: {
        type: 'donut'
      },
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
      fill: {
        type: 'solid',
        opacity: 1,
        colors: [
          '#7BCB0A',
          '#4E36E2',
        ],
      },
      labels: ['On Time', 'Delayed'],
      plotOptions: {
        pie: {
          donut: {
            size: '55%'
          }
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          color: '#616161'
        },
        align: 'center',
      },
      tooltip: {
        fillSeriesColor: false,
        shared: false,
        marker: {
          show: false,
        },
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      }
    };
    this.chartOptions3 = {
      series: [820, 80],
      chart: {
        type: 'donut'
      },
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
      fill: {
        type: 'solid',
        opacity: 1,
        colors: [
          '#7BCB0A',
          '#4E36E2',
        ],
      },
      labels: ['On Time', 'Delayed'],
      plotOptions: {
        pie: {
          donut: {
            size: '55%'
          }
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          color: '#616161'
        },
        align: 'center'
      },
      tooltip: {
        fillSeriesColor: false,
        shared: false,
        marker: {
          show: false,
        },
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      }
    };
    this.chartOptions2 = {
      series: [60],
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
      chart: {
        height: 190,
        type: 'radialBar',
      },
      fill: {
        colors: ['#8BC740']
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '65%',
            margin: 10,
          },
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#6c6c6c',
              fontWeight: 600,
              fontFamily: 'Roboto',
              offsetY: -10,
            },
            value: {
              fontSize: '26px',
              color: '#8BC740',
              offsetY: 5,
            },
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Issued POs'],

    };
    this.chartOptions22 = {
      series: [60],
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
      chart: {
        height: 190,
        type: 'radialBar',
      },
      fill: {
        colors: ['#8BC740']
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '65%',
            margin: 10,
          },
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#6c6c6c',
              fontWeight: 600,
              fontFamily: 'Roboto',
              offsetY: -10,
            },
            value: {
              fontSize: '26px',
              color: '#8BC740',
              offsetY: 5,
            },
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Issued Receipts'],

    };
    this.chartOptions = {
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
          name: 'No of Deliveries',
          data: [230, 420, 610, 755]
        },
      ],
      chart: {
        height: 200,
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
          '#7BCB0A',
          '#1AAFD0',
          '#4E36E2',
          '#0192FF',
        ],
      },

      plotOptions: {
        bar: {
          columnWidth: '70%',
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
          text: 'No of Deliveries'
        }
      },
      xaxis: {
        categories: [
          ['5<'],
          ['5-10'],
          ['11-30'],
          ['30+'],

        ],
        title: {
          text: 'Days Delayed'
        },
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

  exportToExcel() {

  }
  exportToPdf() {

  }

  ngOnInit(): void {

    this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + this.supplierId)
      .subscribe(data => {
        this.supplierName = data[0]['supplier_name']
        this.supplierStatus = data[0]['status']
      })
    this.http.get(environment.nodeurl + '/api/supplier/reviewOutcomeBySupplier?sessionId=0&&supplierId=' + this.supplierId)
      .subscribe((data: ReviewOutcome[]) => {
        if (data) {
          this.outcomes = new MatTableDataSource<ReviewOutcome>(data);
          
        }
      });
  }

}
