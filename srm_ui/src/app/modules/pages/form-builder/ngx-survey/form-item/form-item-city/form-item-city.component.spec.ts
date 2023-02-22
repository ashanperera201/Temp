import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemCityComponent } from './form-item-city.component';

describe('FormItemCityComponent', () => {
  let component: FormItemCityComponent;
  let fixture: ComponentFixture<FormItemCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormItemCityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
