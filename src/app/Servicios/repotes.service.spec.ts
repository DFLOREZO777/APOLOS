import { TestBed } from '@angular/core/testing';

import { RepotesService } from './repotes.service';

describe('RepotesService', () => {
  let service: RepotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
