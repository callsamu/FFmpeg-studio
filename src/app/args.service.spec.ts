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

  it('#setArgs should parse args', () => {
    service.setArgs(`ffmpeg -i "hello world.mp4" output.mp4`);
    expect(service.args).toHaveSize(3);
    expect(service.args.join(',')).toBe(`-i,"hello world.mp4",output.mp4`);
  });

  it('#output should return command output filename', () => {
    service.setArgs("ffmpeg -i output.mp4");
    expect(service.output()).toBe("output.mp4");
  });

  it('#filenames should return list of uploaded files', () => {
    const want = ["foo", "bar", "foobar"];
    want.forEach(filename => service.addFile(new File([], filename)));

    const got = service.filenames();
    expect(got).toHaveSize(want.length);

    want.forEach((value, key) => expect(value).toBe(got[key]));
  })
});
