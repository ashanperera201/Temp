import { TestBed } from '@angular/core/testing';

import { IdentitylinkService } from './identitylink.service';

describe('IdentitylinkService', () => {
  let service: IdentitylinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentitylinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
