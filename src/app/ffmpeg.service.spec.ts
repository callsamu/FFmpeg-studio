import { TestBed } from '@angular/core/testing';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { ArgsService } from './args.service';
import { FFmpegService } from './ffmpeg.service';
import { MessageService } from './message.service';

const array = new Uint8Array();
const file = new File([array], "file");

describe('FFmpegService', () => {

  let service: FFmpegService;

  let argServiceSpy: jasmine.SpyObj<ArgsService>;

  let loadSpy: jasmine.Spy<() => Promise<void>>;
  let runSpy: jasmine.Spy<(...args: string[]) => Promise<void>>;
  let FSSpy: any;

  beforeEach(() => {
    argServiceSpy = jasmine.createSpyObj('ArgsService', {
      getArgs: ["-i", "foobar.mkv", "output.mp4"],
      getFiles: new Map([["file", file]]),
      output: "output.mp4",
    });

    const ffmpegServiceFactory = (args: ArgsService, messaging: MessageService) => {
      const ffmpeg = createFFmpeg();

      loadSpy = spyOn(ffmpeg, "load").and.callFake(async () => {});
      FSSpy = spyOn(ffmpeg, "FS").and.returnValues(array);

      runSpy = spyOn(ffmpeg, "run").and.callFake(async () => {
        expect(service.running)
          .withContext("running ffmpeg")
          .toBeTrue();
      });

      return new FFmpegService(ffmpeg, args, messaging);
    };

    TestBed.configureTestingModule({ providers: [
      MessageService,
      { provide: ArgsService, useValue: argServiceSpy},
      {
        provide: FFmpegService,
        useFactory: ffmpegServiceFactory,
        deps: [ArgsService, MessageService]
      }
    ]});

    service = TestBed.inject(FFmpegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set ready on #load', async () => {
    await service.load();
    expect(service.ready).toBeTrue();
  });

  describe('#run', () => {
    it('should throw error when load has not been called', async () => {
      await expectAsync(service.run()).toBeRejected();
    });

    it('should run ffmpeg command provided by args service', async () => {
      await service.load();
      await service.run();

      expect(argServiceSpy.getArgs).toHaveBeenCalled();
      expect(FSSpy).toHaveBeenCalledOnceWith("writeFile", "file", array);
      expect(runSpy).toHaveBeenCalledOnceWith(...argServiceSpy.getArgs());

      expect(service.done).withContext("ffmpeg finished running").toBeTrue();
    });
  })

  it('should be able to retrieve output URL', async () => {
    const output = service.output();

    expect(output).not.toBeNull();
    if (!output) return;

    const response = await fetch(output);
    const blob = await response.blob();

    expect(blob.type).toBe("video/mp4");
  });
});
