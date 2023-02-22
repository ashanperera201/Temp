import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTablesComponent } from './item-tables.component';

describe('ItemTablesComponent', () => {
  let component: ItemTablesComponent;
  let fixture: ComponentFixture<ItemTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
