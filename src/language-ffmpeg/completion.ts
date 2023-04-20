import { completeFromList } from '@codemirror/autocomplete';

// Provides a list of labels for CodeMirror completion
export const COMPLETIONS = completeFromList([
  {label: "-i", type: "flag", detail: "input file path"},
  {label: "-ss", type: "flag", detail: "start time offset"},
  {label: "-t", type: "flag", detail: "duration of the output file"},
  {label: "-c:v", type: "flag", detail: "video codec"},
  {label: "-c:a", type: "flag", detail: "audio codec"},
  {label: "-s", type: "flag", detail: "video resolution"},
  {label: "-b:v", type: "flag", detail: "video bitrate"},
  {label: "-b:a", type: "flag", detail: "audio bitrate"},
  {label: "-r", type: "flag", detail: "frames per second"},
  {label: "-ac", type: "flag", detail: "number of audio channels"},
  {label: "-f", type: "flag", detail: "output file format"},
  {label: "-map", type: "flag", detail: "select streams for output"},
  {label: "-filter_complex", type: "flag", detail: "apply complex filters to the input"},
  {label: "-vf", type: "flag", detail: "apply video filter to the input"},
  {label: "-af", type: "flag", detail: "apply audio filter to the input"},
  {label: "-metadata", type: "flag", detail: "set metadata for the output"},
  {label: "-y", type: "flag", detail: "overwrite output file without asking"},
  {label: "-n", type: "flag", detail: "do not overwrite output file"},
  {label: "-loglevel", type: "flag", detail: "set logging level for ffmpeg"},
  {label: "-hide_banner", type: "flag", detail: "hide ffmpeg banner"},
  {label: "-crf", type: "flag", detail: "set constant rate factor for video quality control"},
  {label: "-preset", type: "flag", detail: "set the encoding speed preset"},
  {label: "-profile:v", type: "flag", detail: "set the video encoding profile"},
  {label: "-level:v", type: "flag", detail: "set the video encoding level"},
  {label: "-pix_fmt", type: "flag", detail: "set the pixel format of the output video"},
  {label: "-movflags", type: "flag", detail: "set MOV/MP4 format specific flags"},
  {label: "-copyts", type: "flag", detail: "copy input timestamps to output"},
  {label: "-copytb", type: "flag", detail: "copy input timebase to output"},
  {label: "-c:v copy", type: "flag", detail: "copy video codec without re-encoding"},
  {label: "-c:a copy", type: "flag", detail: "copy audio codec without re-encoding"},
  {label: "-vf scale", type: "flag", detail: "resize video"},
  {label: "-af volume", type: "flag", detail: "adjust audio volume"},
  {label: "-filter:v", type: "flag", detail: "set video filtergraph"},
  {label: "-filter:a", type: "flag", detail: "set audio filtergraph"},
  {label: "-tune", type: "flag", detail: "set the encoder tuning options"},
  {label: "-qscale", type: "flag", detail: "set the video quantizer scale"},
  {label: "-qmin", type: "flag", detail: "set the minimum video quantizer scale"},
  {label: "-qmax", type: "flag", detail: "set the maximum video quantizer scale"},
  {label: "-b:a", type: "flag", detail: "set audio bitrate"},
  {label: "-ar", type: "flag", detail: "set audio sampling rate"},
  {label: "-af pan", type: "flag", detail: "set audio panning"},
  {label: "-sshdetect", type: "flag", detail: "detect and skip text subtitles"},
  {label: "-sn", type: "flag", detail: "disable subtitle recording"},
  {label: "-vsync", type: "flag", detail: "set video synchronization ,method"},
  {label: "-async", type: "flag", detail: "set audio synchronization method"},
]);
