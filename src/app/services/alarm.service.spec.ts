import { TestBed } from '@angular/core/testing';

import { AlarmService } from './alarm.service';

describe('FirestoreService', () => {
  let service: AlarmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
