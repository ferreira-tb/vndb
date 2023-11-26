export const regexIdImage = {
  character: /ch\d+/,
  screenshot: /sf\d+/,
  thumbnail: /st\d+/,
  vn: /cv\d+/
} as const;

export const regexId = {
  character: /c\d+/,
  image: regexIdImage,
  producer: /p\d+/,
  release: /r\d+/,
  tag: /g\d+/,
  trait: /i\d+/,
  user: /u\d+/,
  vn: /v\d+/
} as const;
