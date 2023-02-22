import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinitiationNoteComponent } from './reinitiation-note.component';

describe('ReinitiationNoteComponent', () => {
  let component: ReinitiationNoteComponent;
  let fixture: ComponentFixture<ReinitiationNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinitiationNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinitiationNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
