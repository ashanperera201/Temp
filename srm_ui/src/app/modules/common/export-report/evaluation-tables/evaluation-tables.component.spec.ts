import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationTablesComponent } from './evaluation-tables.component';

describe('EvaluationTablesComponent', () => {
  let component: EvaluationTablesComponent;
  let fixture: ComponentFixture<EvaluationTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
