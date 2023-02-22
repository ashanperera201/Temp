import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponcesComponent } from './responces.component';

describe('ResponcesComponent', () => {
  let component: ResponcesComponent;
  let fixture: ComponentFixture<ResponcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
