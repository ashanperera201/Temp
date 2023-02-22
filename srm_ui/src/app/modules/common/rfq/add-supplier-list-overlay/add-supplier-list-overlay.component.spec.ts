import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierListOverlayComponent } from './add-supplier-list-overlay.component';

describe('AddSupplierListOverlayComponent', () => {
  let component: AddSupplierListOverlayComponent;
  let fixture: ComponentFixture<AddSupplierListOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierListOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierListOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
