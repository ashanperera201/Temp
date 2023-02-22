import { Component, ViewChild, OnInit, Input } from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexGrid,
    ApexStates,
} from 'ng-apexcharts';
import { threadId } from 'worker_threads';

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
    data: any;
};

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
    public charts: Partial<ChartOptions>;

    @Input() supplierCharts;
    @Input() horizontal;
    @Input() y_axis;
  
    chart: any = [];
    chartValue: any = [];
    allCharts: any = []; 
    supplier: any[];

    constructor() {
      
    }

    ngOnInit(): void {
      let chart = [];
      let chartValue = [];
      const supplier = [];
      const filter = [];
      this.supplierCharts.forEach((element, i) => {
          filter[i] = element.data;

          supplier.push(element?.supplier);
          this.supplier = supplier;
      });

      for (let index = 0; index < filter.length; index++) {
          const el = filter[index];

          for (let i = 0; i < el.length; i++) {
              chart.push(el[i].name);
              chartValue.push(el[i].value);
          }

          this.chart[index] = chart;
          this.chartValue[index] = chartValue;

          chart = [];
          chartValue = [];
      }

      for (let index = 0; index < this.supplierCharts.length; index++) {
          this.charts = {
              states: {
                  normal: {
                      filter: {
                          type: 'none',
                          value: 0,
                      },
                  },
                  hover: {
                      filter: {
                          type: 'darken',
                          value: 0.2,
                      },
                  },
                  active: {
                      allowMultipleDataPointsSelection: false,
                      filter: {
                          type: 'none',
                          value: 0,
                      },
                  },
              },
              series: [
                  {
                      name: this.y_axis,
                      data: this.chartValue[index],
                  },
              ],
              chart: {
                  height: 300,
                  type: 'bar',
                  toolbar: {
                      show: false,
                  },
                  animations: {
                      enabled: false,
                  },
              },
              stroke: {
                show: true,
                width: 0.2,
                colors: ["transparent"]
              },
              fill: {
                  type: 'solid',
                  opacity: 1,
                  colors: ['#003f5c', '#374c80','#7a5195','#bc5090','#ef5675',' #ff764','#ffa600'],
              },

              plotOptions: {
                  bar: {
                      columnWidth: '40%',
                      horizontal: this.horizontal,
                      distributed: true,
                      dataLabels: {
                          position: 'top', // top, center, bottom
                      },
                  },
              },
              dataLabels: {
                enabled: false,
                  formatter: function (val) {
                      return val + '';
                  },
                  offsetY: -20,
                  offsetX: 0,
                  style: {
                      fontSize: '12px',
                      colors: ['#464A53'],
                  },
              },
              legend: {
                  show: false,
              },
              grid: {
                  show: false,
              },
              yaxis: {
                  title: {
                      text: this.y_axis,
                  },
              },
              xaxis: {
                  categories: this.chart[index],
                  title: {
                      text: this.supplier[index],
                  },
                  labels: {
                      style: {
                          colors: ['#464A53'],
                          fontSize: '12px',
                      },
                  },
              },
              tooltip: {
                  y: {
                      formatter: function (val) {
                          return val + '';
                      },
                  },
              },
          };

          this.allCharts.push(this.charts);
      }

    }
}
