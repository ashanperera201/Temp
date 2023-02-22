import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionAddDialogComponent } from './terms-and-condition-add-dialog.component';

describe('TermsAndConditionAddDialogComponent', () => {
  let component: TermsAndConditionAddDialogComponent;
  let fixture: ComponentFixture<TermsAndConditionAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionAddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
