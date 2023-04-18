import { TestBed } from '@angular/core/testing';

import { ArgsService } from './args.service';

describe('ArgsService', () => {
  let service: ArgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArgsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
