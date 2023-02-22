import { Injectable } from '@angular/core';
import { ReviewResponse, ReviewSession, ReviewOutcome, ReviewTodo } from './supplier-review-models';
import { environment } from 'environments/environment.prod';
@Injectable()
export class DataService {
    reviewSession: ReviewSession;
    approvalState: number = 0;
    editResponse: number;
    summaryView:number =0;
    landingTab: number;
    reviewResponse: ReviewResponse;
    reviewers: string[] = [];
    sessionId: number;
    supplierId: number;
    outcome: ReviewOutcome;
    outcomes: ReviewOutcome [];
    sessionNames:string[];
    todoOrigin :number = 0;
    currentToDo?: ReviewTodo;
}
