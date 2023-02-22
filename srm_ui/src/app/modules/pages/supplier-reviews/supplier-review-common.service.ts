import { Injectable } from '@angular/core';
import { ReviewResponse } from './supplier-review-models';
import { environment } from 'environments/environment.prod';
import { SupplierReviewConstants } from './supplier-review-constants';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class SupplierReviewService {

    constructor( private http: HttpClient) {
      }
    presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
    customTypePeriod = SupplierReviewConstants.customTypePeriod;
    notRecommendedOutcome = SupplierReviewConstants.notRecommendedOutcome;
    recommendedOutcome = SupplierReviewConstants.recommendedOutcome;
    noOutcome = SupplierReviewConstants.noOutcome;
    gradingMethodA = SupplierReviewConstants.gradingMethodA;
    gradingMethodB = SupplierReviewConstants.gradingMethodB;
    gradingMethodC = SupplierReviewConstants.gradingMethodC;
    gradingMethodD = SupplierReviewConstants.gradingMethodD;
    reviewApproverWaitingState = SupplierReviewConstants.reviewApproverWaitingState;
    reviewResponseRejectedState = SupplierReviewConstants.reviewResponseRejectedState;
    
    calculateOutcome(outcome) {
        let gradeCategories = []
        JSON.parse(outcome.gradeCategories).forEach(x => {
        gradeCategories.push(x)
        });
        let score =0;
        let isRejected = false;
        let finalOutcome = this.noOutcome;
        this.http.get(environment.nodeurl + '/api/supplier/sessionReviewResponseScores?reviewSessionId=' + outcome.sessionId + 
        '&&supplierid=' + outcome.supplierId).subscribe((data: ReviewResponse[]) => {
            if (data.length>0) {
                if (outcome.gradingMethod == this.gradingMethodA) {
                    score = (data.reduce((accumulator, current) => accumulator + current.score, 0)) / data.length;
                    gradeCategories.forEach((category) => {
                    if (score >= category.lowerBound && score <= category.upperBound) {
                        finalOutcome = category.category;
                    }
                    });
                }
                if (outcome.gradingMethod == this.gradingMethodB) {
                    var reviewerWeights = [];
                    JSON.parse(outcome.reviewerWeights).forEach(x => {
                    reviewerWeights.push(x);
                    });
                    data.forEach((response) => {
                    score = score + 0.01 * response.score * reviewerWeights.find(reviewer => reviewer.reviewer == response.conductedUser).weight;
                    });
                    gradeCategories.forEach((category) => {
                    if (score >= category.lowerBound && score <= category.upperBound) {
                        finalOutcome = category.category;
                    }
                    });
                }
                if (outcome.gradingMethod == this.gradingMethodC) {
                    score = (data.reduce((accumulator, current) => accumulator + current.score, 0)) / data.length;
                    finalOutcome = this.recommendedOutcome;
                    data.forEach((response) => {
                    if (response.score < outcome.minGradeThreshold) {

                        finalOutcome = this.notRecommendedOutcome;
                    }
                    });
                }
                if (outcome.gradingMethod == this.gradingMethodD) {
                    score = (data.reduce((accumulator, current) => accumulator + current.score, 0)) / data.length;
                    let counts: { [key: string]: number } = {};
                    gradeCategories.forEach((category) => {
                    counts[category.category] = 0;
                    });
                    data.forEach((response) => {
                    gradeCategories.forEach((category) => {
                        if (response.score >= category.lowerBound && response.score <= category.upperBound) {
                        counts[category.category] = counts[category.category] + 1;
                        }
                    });
                    });
                    let maxOccurance = 1;
                    for (let key in counts) {
                    let value = counts[key];
                    if (value > maxOccurance) {
                        maxOccurance = value;
                        finalOutcome = key;
                    }
                    }
                }
                outcome.outcome = finalOutcome;
                outcome.finalScore = Math.round(score);
                console.log("saving outcome results 1", outcome)
                this.http.post<any>(environment.nodeurl + '/api/supplier/reviewoutcome', outcome)
                .subscribe(data1 => {
                    data.forEach((response) => {
                        if (response.status == this.reviewResponseRejectedState){
                            isRejected = true;
                        }
                    });
                    // if (isRejected){

                    if (outcome.periodType == this.presetTypePeriod) {
                        var period = outcome.presetPeriod + ", " + outcome.reviewYear
                        }
                    else {
                    period = outcome.startDate.toString().slice(0, 10) + " to " + outcome.endDate.toString().slice(0, 10);
                            
                    }
                    console.log("sending supplier email 2",  outcome.finalScore,  outcome.outcome, outcome)
            
                    this.http.post<any>(environment.nodeurl + '/api/email/supplierReviewCompleteMail?supplierEmail=' + outcome.supplierEmail + 
                    '&period=' + period + '&reviewScore=' + outcome.finalScore+ '&evaluationName=' + outcome.evaluationName + 
                    '&reviewOutcome=' + outcome.outcome, null)
                    .subscribe(data => {
                    })
                    // }
                    return finalOutcome;
                });
                // remove automatic blocknig of supplier when not recommended
                // if (finalOutcome === this.notRecommendedOutcome) {
                // this.http.post<any>(environment.nodeurl + '/api/supplier/reviewOutcomeSupplier', outcome.supplierId)
                //     .subscribe(data => {
                //     return finalOutcome;
                //     });
                // }
              
                }
            else{
                outcome.finalScore = score;
                outcome.status = "completed";
                console.log("saving outcome results 2", outcome)
                this.http.post<any>(environment.nodeurl + '/api/supplier/reviewoutcome', outcome)
                .subscribe(data => {

                    if (outcome.periodType == this.presetTypePeriod) {
                        var period = outcome.presetPeriod + ", " + outcome.reviewYear
                      }
                      else {
                        period = outcome.startDate.toString().slice(0, 10) + " to " + outcome.endDate.toString().slice(0, 10);
                             
                      }
                      console.log("sending supplier email 3",  outcome.finalScore,  outcome.outcome, outcome)
              
                    this.http.post<any>(environment.nodeurl + '/api/email/supplierReviewCompleteMail?supplierEmail=' + outcome.supplierEmail + 
                    '&period=' + period + '&reviewScore=' + outcome.finalScore+ '&evaluationName=' + outcome.evaluationName + 
                    '&reviewOutcome=' + outcome.outcome, null)
                    .subscribe(data => {
                        return outcome;
                    })

                   
                });
            }
        });
}


}


  