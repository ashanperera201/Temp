import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRfqPartLineOverlayComponent } from './edit-rfq-part-line-overlay.component';

describe('EditRfqPartLineOverlayComponent', () => {
  let component: EditRfqPartLineOverlayComponent;
  let fixture: ComponentFixture<EditRfqPartLineOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRfqPartLineOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRfqPartLineOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
