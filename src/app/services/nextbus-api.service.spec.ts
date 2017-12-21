import { TestBed, inject } from '@angular/core/testing';

import { NextbusApiService } from './nextbus-api.service';

describe('NextbusApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NextbusApiService]
    });
  });

  it('should be created', inject([NextbusApiService], (service: NextbusApiService) => {
    expect(service).toBeTruthy();
  }));
});
