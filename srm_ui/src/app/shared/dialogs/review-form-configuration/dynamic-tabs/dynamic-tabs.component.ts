import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ReviewFormService } from '../../../../shared/Services/review-form.service';
import { ReviewFormView } from '../../../../shared/Models/review-form.model';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dynamic-tabs',
  templateUrl: './dynamic-tabs.component.html',
  styleUrls: ['./dynamic-tabs.component.scss']
})
export class DynamicTabsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() count!: number;

  isEditable: boolean;
  reviewFormView!: ReviewFormView[];
  destroy$ = new Subject<boolean>();
  allReviewForms: any[] = [];

  reviewFormControl = new FormControl('');
  filteredOptions: Observable<string[]>;

  constructor(private reviewFormService: ReviewFormService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const count = changes['count']?.currentValue;
    if (count && count > 0) {
      this.buildView(count);
    }
  }

  ngOnInit(): void {
    this.fetchAllReviewForms();
    this.fieldOnListner();
  }

  fieldOnListner = (): void => {
    this.filteredOptions = this.reviewFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  fetchAllReviewForms = (): void => {
    this.reviewFormService.fetchAllReviewForms().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          this.allReviewForms = response;
        }
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  buildView = (count: number): void => {
    this.reviewFormView = [];
    for (let i = 0; i < count; i++) {
      this.reviewFormView.push(
        {
          index: i,
          isEditable: false,
          tabTitle: `Tab ${i + 1}`
        }
      )
    }
  }

  onInputChange = (i: number): void => {
    const value = this.reviewFormControl.value;
    const reviewForm = this.allReviewForms.find(x => x.name === value);
    this.reviewFormView[i].selectedReviewForm = reviewForm;
    this.reviewFormControl.setValue('', { onlySelf: true })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allReviewForms.filter(x => x.name.toLowerCase().includes(filterValue));
  }

  onTabEditHeader = (reviewForm: ReviewFormView, i: number): void => {
    this.reviewFormView[i].isEditable = !this.reviewFormView[i].isEditable;
    this.reviewFormView[i].tabTitle = this.reviewFormView[i].tabTitle;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
