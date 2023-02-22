import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReviewReinitiationComponent } from './supplier-review-reinitiation.component';

describe('SupplierReviewReinitiationComponent', () => {
  let component: SupplierReviewReinitiationComponent;
  let fixture: ComponentFixture<SupplierReviewReinitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierReviewReinitiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierReviewReinitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
