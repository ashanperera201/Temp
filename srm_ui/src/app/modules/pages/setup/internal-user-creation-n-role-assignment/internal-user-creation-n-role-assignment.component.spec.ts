import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserCreationNRoleAssignmentComponent } from './internal-user-creation-n-role-assignment.component';

describe('InternalUserCreationNRoleAssignmentComponent', () => {
  let component: InternalUserCreationNRoleAssignmentComponent;
  let fixture: ComponentFixture<InternalUserCreationNRoleAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalUserCreationNRoleAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalUserCreationNRoleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
