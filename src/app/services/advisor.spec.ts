import { TestBed } from '@angular/core/testing';

import { Advisor } from './advisor';

describe('Advisor', () => {
  let service: Advisor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Advisor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
