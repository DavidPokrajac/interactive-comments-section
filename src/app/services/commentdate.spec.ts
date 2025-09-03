import { TestBed } from '@angular/core/testing';

import { Commentdate } from './commentdate';

describe('Commentdate', () => {
  let service: Commentdate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Commentdate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
