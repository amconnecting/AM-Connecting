export function isTooLarge(input, maxCharacters = 8000) {
  return JSON.stringify(input || {}).length > maxCharacters;
}

export function tooLargeResponse() {
  return {
    ok: false,
    error: "The submitted text is too long. Please shorten it and try again."
  };
}
