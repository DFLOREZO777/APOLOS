import { TestBed } from '@angular/core/testing';

import { AbonosService } from './abonos.service';

describe('AbonosService', () => {
  let service: AbonosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbonosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
