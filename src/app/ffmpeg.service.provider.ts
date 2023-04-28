import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { ArgsService } from "./args.service";
import { FFmpegService } from "./ffmpeg.service";
import { MessageService } from "./message.service";

const ffmpegServiceFactory = (messaging: MessageService, args: ArgsService) => {
  return new FFmpegService(createFFmpeg({ log: true }), args, messaging);
}

export const ffmpegServiceProvider = {
  provide: FFmpegService,
  useFactory: ffmpegServiceFactory,
  deps: [MessageService, ArgsService],
}
