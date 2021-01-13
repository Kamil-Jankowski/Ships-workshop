import { TestBed } from '@angular/core/testing';

import { RandomShipPlacementService } from './random-ship-placement.service';

describe('RandomShipPlacementService', () => {
  let service: RandomShipPlacementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomShipPlacementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
