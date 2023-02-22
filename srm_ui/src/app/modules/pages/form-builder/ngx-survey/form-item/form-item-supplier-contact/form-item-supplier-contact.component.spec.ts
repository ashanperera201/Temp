import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemSupplierContactComponent } from './form-item-supplier-contact.component';

describe('FormItemSupplierContactComponent', () => {
  let component: FormItemSupplierContactComponent;
  let fixture: ComponentFixture<FormItemSupplierContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormItemSupplierContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemSupplierContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
