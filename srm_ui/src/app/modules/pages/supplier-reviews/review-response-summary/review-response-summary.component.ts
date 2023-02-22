/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { DataService } from '../supplier-review-data.service';
import { ReviewerSectionScore, ReviewOutcome, ReviewResponse, Tabs } from '../supplier-review-models';
import { Location } from '@angular/common';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

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
  selector: 'app-review-response-summary',
  templateUrl: './review-response-summary.component.html',
  styleUrls: ['./review-response-summary.component.scss']

})
export class ReviewResponseSummaryComponent implements OnInit {
  outcome: ReviewOutcome;
  reviewResponses: ReviewResponse[];
  outcomeResult: [number, string][];
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod
  customTypePeriod = SupplierReviewConstants.customTypePeriod
  form: any;
  displayedColumns13 = ["reviewerName", "conductedDate", "score", "review"]
  displayedColumns12 = ["score", "recommendation"]
  reviewerSectionScores: ReviewerSectionScore[] = [];
  questions = [];
  displayedQuestionColumns = ['No#', 'Section'];
  questionSource = [];
  sectionScores = [];
  public chartOptionsRanks: Partial<ChartOptions> = {};
  public charts: Partial<ChartOptions>;
  xData: number[] = [];
  yData: string[] = [];
  questionCharts: any[] = [];
  chart: any = [];
  chartValue: any = [];
  question: any = [];
  allCharts: any = [];
  scoredSession = false;
  proceedDownload: boolean =false;
  
  constructor(private _location: Location, private router: Router, private http: HttpClient, public dataService: DataService, public httpClient: HttpClient) {
    this.outcome = dataService.outcome;
    this.outcomeResult = [[this.outcome.finalScore, this.outcome.outcome]]
    if (this.outcome.periodType == this.customTypePeriod) { 
      let startMonth = this.outcome.startDate.getMonth()+1;
      let endMonth = this.outcome.endDate.getMonth()+1;
      this.outcome.presetPeriod = (('0'+ this.outcome.startDate.getDate()).slice(-2)+"/"+
      ('0'+ startMonth).slice(-2)+"/"+
      (this.outcome.startDate.getFullYear())) + " - " +
      (('0'+ this.outcome.endDate.getDate()).slice(-2)+"/"+
      ('0'+ endMonth).slice(-2)+"/"+
      (this.outcome.endDate.getFullYear()));
    }
    this.http.get(environment.nodeurl + '/api/supplier/sessionReviewResponseScores?reviewSessionId=' +
      this.outcome.sessionId + '&&supplierid=' + this.outcome.supplierId)
      .subscribe((data: ReviewResponse[]) => {
        if (data) {
          this.reviewResponses = data;
          this.form = JSON.parse(this.reviewResponses[0].review);
          this.dataService.sessionId = this.outcome.sessionId;
          this.dataService.supplierId = this.outcome.supplierId;
          this.reviewResponses.forEach((reviewResponse) => {
            this.displayedQuestionColumns.push(reviewResponse.conductedUser);
            var form = JSON.parse(reviewResponse.review);
            this.xData.push(reviewResponse.score);
            this.dataService.reviewers.push(reviewResponse.conductedUser);

            this.yData.push(reviewResponse.conductedUser);
            form.forEach((section) => {
              if (section.hasOwnProperty('enableScore') && section['enableScore']==true) {
                this.scoredSession = true;

                var reviewerSectionScore: ReviewerSectionScore = {
                  reviewer: reviewResponse.conductedUser,
                  section: section.title,
                  score: this.get_section_score(section)
                }
                this.reviewerSectionScores.push(reviewerSectionScore)
              }
            });
          });
          this.displayedQuestionColumns.push('Average');
          var sections: { [section: string]: [{ name: string, score: number }]; } = {};
          this.reviewerSectionScores.forEach((reviewerSectionScore) => {
            if (!sections.hasOwnProperty(reviewerSectionScore.section)) {
              sections[reviewerSectionScore.section] =
                [{ name: reviewerSectionScore.reviewer, score: reviewerSectionScore.score }]
            }
            else {
              sections[reviewerSectionScore.section].push(
                { name: reviewerSectionScore.reviewer, score: reviewerSectionScore.score });
            }

          });
          let count = 1;

          for (let key in sections) {
            let reviewerScores = sections[key];
            var scores = []
            var section = []
            var chart_scores = []
            section.push(count);
            section.push(key);
            reviewerScores.forEach((reviewerScore) => {
              scores.push(reviewerScore.score);
              section.push(reviewerScore.score);
              chart_scores.push({ name: reviewerScore.name, value: reviewerScore.score })
            })
            const sum = scores.reduce((a, b) => a + b, 0);
            var avg_score = (sum / scores.length) || 0;
            section.push(Math.round(avg_score));
            this.questions.push(section);
            this.questionCharts.push(
              { question: key, data: chart_scores })
            count += 1;
          }
          this.updateSectionCharts()
        };
      });

    this.updateSectionCharts();
    this.chartOptionsRanks = {
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
          name: 'Total Score',
          data: this.xData
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
          text: 'Total Score'
        }
      },
      xaxis: {
        categories: this.yData,
        title: {
          text: 'Reviewer'
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

  

  updateSectionCharts() {
    let chart = [];
    let chartValue = [];
    const question = [];
    const filter = [];

    this.questionCharts.forEach((element, i) => {

      filter[i] = element.data;

      question.push(element?.question);
      this.question = question;
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

    for (let index = 0; index < this.questionCharts.length; index++) {
      this.charts = {
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
            name: 'Score',
            data: this.chartValue[index]
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
            text: 'Score'
          }
        },
        xaxis: {
          categories: this.chart[index],
          title: {
            text: this.question[index],
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

      this.allCharts.push(this.charts);
    }
  }
  get_section_score(section) {
    var score = 0;
    var denominator = 0;
    section.items.forEach((item) => {
      if (item.score!=undefined){
      denominator += 5;
      score += +item.score;
      }
    });
    return Math.floor((score * 100 / denominator) * 100) / 100;

  }
  ngOnInit(): void {

  }
  goToReviewResponse(reviewResponseId) {
    this.dataService.editResponse = 0;
    this.dataService.summaryView = 1;
    this.router.navigate(['/review-response-page/' + reviewResponseId]);
  }

  goBack() {
    this.dataService.landingTab = Tabs.Review_Outcomes;
    this._location.back();
  }

  saveAsPDF() {
    this.saveToPDF();
    const dashboard: any = document.getElementById('printSection');
    this.proceedDownload =true;
    const options = { background: 'white' };

    setTimeout(() => {
      domtoimage.toPng(dashboard, options).then((imgData: any) => {
        const doc = new jsPDF('p', 'mm');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save(this.outcome.evaluationName +'.pdf');
        this.proceedDownload =false;
    });   
    }, 100);

   
}

saveToPDF() {
  const dashboard: any = document.getElementById('printSection');
  this.proceedDownload =true;
  const options = { background: 'white' };
  const dashboardHeight = dashboard.scrollHeight;
  const dashboardWidth = dashboard.scrollWidth;

  domtoimage.toPng(dashboard, options).then(async (imgData: any) => {
          const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

          // var blobPDF =  new Blob([imgData], { type : 'application/pdf'});
          // var blobPDF = new Blob([imgData], { type: "image/png" });
          var blobPDF =  new Blob([ doc.output() ], { type : 'application/pdf'});

          
          var blobUrl = URL.createObjectURL(blobPDF);
          console.log("The pdf file here : " + blobUrl);
          console.log("The pdf file here : " + imgData);
          
          var urlblob = environment.nodeurl + '/api/file/uploadpdfFiles';
          const formData = new FormData();
              formData.append('file', blobPDF);
          
              
              this.httpClient.post<any>(environment.nodeurl + '/api/file/uploadpdfFiles', formData).subscribe(data => {
                  var responseonqueue = data;

              });    
          //window.open(blobUrl); 

          //doc.save('Chart.pdf');
      })
}
}

