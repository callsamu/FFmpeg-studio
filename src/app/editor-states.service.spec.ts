import { TestBed } from '@angular/core/testing';

import { EditorStatesService } from './editor-states.service';

describe('EditorStatesService', () => {
  let service: EditorStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
