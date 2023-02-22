import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionViewDialogComponent } from './terms-and-condition-view-dialog.component';

describe('TermsAndConditionViewDialogComponent', () => {
  let component: TermsAndConditionViewDialogComponent;
  let fixture: ComponentFixture<TermsAndConditionViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
