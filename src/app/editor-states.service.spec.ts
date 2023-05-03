import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/storage.service';
import { ArgsService } from './args.service';

import { EditorStatesService } from './editor-states.service';

const command = "ffmpeg -i foobar.mkv foo.mp4";

describe('EditorStatesService', () => {
  let service: EditorStatesService;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('StorageService', {
      fetch: command,
    });

    const spyArgs = jasmine.createSpyObj('ArgsService', {
      getFiles: new Map<string, File>(),
    });

    TestBed.configureTestingModule({ providers: [
      { provide: ArgsService, useValue: spyArgs },
      { provide: StorageService, useValue: spyStorage }
    ]});

    service = TestBed.inject(EditorStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetch created editor state', () => {
    it(`should be a new command if command name name is null`, () => {
      const state = service.fetch(null);
      expect(state.doc.toString()).toBe('ffmpeg');
    })
    it(`state for command name should contain it's document in storage`, () => {
      const state = service.fetch("command");
      expect(state.doc.toString()).toBe(command);
    });
  });
});
