import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTablesComponent } from './selection-tables.component';

describe('SelectionTablesComponent', () => {
  let component: SelectionTablesComponent;
  let fixture: ComponentFixture<SelectionTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
