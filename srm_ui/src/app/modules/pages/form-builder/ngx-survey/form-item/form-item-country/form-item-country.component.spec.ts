import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemCountryComponent } from './form-item-country.component';

describe('FormItemCountryComponent', () => {
  let component: FormItemCountryComponent;
  let fixture: ComponentFixture<FormItemCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormItemCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
