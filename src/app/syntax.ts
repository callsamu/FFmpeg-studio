import { HLJSApi } from "highlight.js";

export function FFmpegSyntax(hljs: HLJSApi) {
  var FFMPEG_COMMANDS = {
    className: 'keyword',
    beginKeywords: 'ffmpeg ffplay ffprobe',
    relevance: 10
  };

  var FFMPEG_OPTIONS = {
    className: 'code',
    begin: '-[a-zA-Z0-9_|\:]+',
    end: ' ',
    relevance: 10
  };

  var FFMPEG_ARGUMENTS = {
    className: 'meta',
    begin: '[a-zA-Z0-9_\.]+',
    end: ' ',
    relevance: 0
  };

  var FFMPEG_STRING = {
    className: 'string',
    begin: '".*?"',
    relevance: 0
  };

  return {
    name: 'FFmpeg commands',
    aliases: ['ffmpeg'],
    keywords: FFMPEG_COMMANDS,
    contains: [
      FFMPEG_COMMANDS,
      FFMPEG_OPTIONS,
      FFMPEG_ARGUMENTS,
      FFMPEG_STRING,
      hljs.NUMBER_MODE,
      hljs.HASH_COMMENT_MODE
    ]
  };
}
