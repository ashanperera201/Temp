import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemTermsAndConditionComponent } from './form-item-terms-and-condition.component';

describe('FormItemTermsAndConditionComponent', () => {
  let component: FormItemTermsAndConditionComponent;
  let fixture: ComponentFixture<FormItemTermsAndConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormItemTermsAndConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemTermsAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
