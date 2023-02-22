import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmergencySupllierComponent } from './add-emergency-supllier.component';

describe('AddEmergencySupllierComponent', () => {
  let component: AddEmergencySupllierComponent;
  let fixture: ComponentFixture<AddEmergencySupllierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmergencySupllierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmergencySupllierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
