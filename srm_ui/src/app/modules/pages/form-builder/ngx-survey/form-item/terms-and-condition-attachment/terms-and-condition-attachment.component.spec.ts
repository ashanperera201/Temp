import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionAttachmentComponent } from './terms-and-condition-attachment.component';

describe('TermsAndConditionAttachmentComponent', () => {
  let component: TermsAndConditionAttachmentComponent;
  let fixture: ComponentFixture<TermsAndConditionAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
