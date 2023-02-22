import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemCountryCityComponent } from './form-item-country-city.component';

describe('FormItemCountryCityComponent', () => {
  let component: FormItemCountryCityComponent;
  let fixture: ComponentFixture<FormItemCountryCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormItemCountryCityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCountryCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
