import { TestBed, inject } from '@angular/core/testing';

import { WsbeApiService } from './wsbe-api.service';

describe('WsbeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsbeApiService]
    });
  });

  it('should be created', inject([WsbeApiService], (service: WsbeApiService) => {
    expect(service).toBeTruthy();
  }));
});
