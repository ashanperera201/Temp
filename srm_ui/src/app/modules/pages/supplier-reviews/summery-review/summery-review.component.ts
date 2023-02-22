import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { DataService } from '../supplier-review-data.service';
import { ReviewerSectionScore, ReviewOutcome, ReviewResponse } from '../supplier-review-models';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';
import { Location } from '@angular/common';

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
    selector: 'summery-review',
    templateUrl: './summery-review.component.html',
    styleUrls: ['./summery-review.component.scss'],
})
export class SummeryReviewComponent implements OnInit {
    outcome: ReviewOutcome;
    questions = [];
    displayedQuestionColumns = ['No#', 'Section'];
    questionSource = [];
    reviewResponses: ReviewResponse[];
    form: any;
    displayedColumns13 = ["reviewerName", "conductedDate", "score", "review"]
    reviewerSectionScores: ReviewerSectionScore[] = [];
    sectionScores = [];
    approvers = [];
    approverNames = [];
    displayedApproverColumns = ['approverId', 'approverName', 'email', 'status', 'approvedDate', 'comments'];
    approverLoggedIn = false;
    stepIndex = 0;
    comment: string;
    xData: number[] = [];
    yData: string[] = [];
    question: any = [];
    allCharts: any = [];
    scoredSession = false;
    customTypePeriod = SupplierReviewConstants.customTypePeriod;


    constructor(public dataService: DataService, private http: HttpClient, public _location: Location,) {
        this.outcome = dataService.outcome;
        if (this.outcome.periodType == this.customTypePeriod) {
            this.outcome.presetPeriod = this.outcome.startDate.toString().slice(0, 10) + "-" + this.outcome.endDate.toString().slice(0, 10)
        }
        this.http.get(environment.nodeurl + '/api/supplier/sessionReviewResponseScores?reviewSessionId=' +
            this.outcome.sessionId + '&&supplierid=' + this.outcome.supplierId).subscribe((data: ReviewResponse[]) => {
                if (data) {
                    this.reviewResponses = data;
                    this.form = JSON.parse(this.reviewResponses[0].review);
                    this.dataService.sessionId = this.outcome.sessionId;
                    this.dataService.supplierId = this.outcome.supplierId;
                    this.reviewResponses.forEach((reviewResponse) => {
                        var form = JSON.parse(reviewResponse.review);
                        this.xData.push(reviewResponse.score);
                        this.dataService.reviewers.push(reviewResponse.conductedUser);

                        this.yData.push(reviewResponse.conductedUser);
                        form.forEach((section) => {
                            if (section.hasOwnProperty('enableScore') && section['enableScore'] == true) {
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
                        section.push(count);
                        section.push(key);
                        reviewerScores.forEach((reviewerScore) => {
                            scores.push(reviewerScore.score);
                          })
                        const sum = scores.reduce((a, b) => a + b, 0);
                        var avg_score = (sum / scores.length) || 0;
                        section.push(Math.round(avg_score));
                        this.questions.push(section);
                        count += 1;
                    }
                };
            });
    }
    get_section_score(section) {
        var score = 0;
        var denominator = 0;
        section.items.forEach((item) => {
            denominator += 5;
            score += +item.score;
        });
        return score * 100 / denominator;

    }
    ngOnInit(): void { }

    onSubmit(): void { }
}
