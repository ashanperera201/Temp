import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewLineCostfactorOverlayComponent } from './add-new-line-costfactor-overlay.component';

describe('AddNewLineCostfactorOverlayComponent', () => {
  let component: AddNewLineCostfactorOverlayComponent;
  let fixture: ComponentFixture<AddNewLineCostfactorOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewLineCostfactorOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewLineCostfactorOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
