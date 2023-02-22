import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAssignTabComponent } from './user-role-assign-tab.component';

describe('UserRoleAssignTabComponent', () => {
  let component: UserRoleAssignTabComponent;
  let fixture: ComponentFixture<UserRoleAssignTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleAssignTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleAssignTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
